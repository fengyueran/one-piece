import React from 'react'
import {
  Store,
  FieldEntity,
  Callbacks,
  ValidateErrorEntity,
  FieldError,
  StoreValue,
  FieldData,
  NamePath,
  InternalNamePath,
} from './types'
import { getNamePath, getValue, setValue, matchNamePath, containsNamePath } from './utils'

export class FormStore {
  private store: Store = {}
  private fieldEntities: FieldEntity[] = []
  private watchList: ((namePath: InternalNamePath) => void)[] = []
  private initialValues: Store = {}
  private callbacks: Callbacks = {}
  private forceRootUpdate: React.Dispatch<React.SetStateAction<object>> | undefined

  constructor(
    forceRootUpdate?: React.Dispatch<React.SetStateAction<object>>,
    initialValues: Store = {},
  ) {
    this.store = { ...initialValues }
    this.initialValues = initialValues
    this.forceRootUpdate = forceRootUpdate
  }

  public getFieldValue = (name: NamePath): StoreValue => {
    const namePath = getNamePath(name)
    return getValue(this.store, namePath)
  }

  public getFieldsValue = (): Store => {
    return { ...this.store }
  }

  public getFieldError = (name: NamePath): string[] => {
    const namePath = getNamePath(name)
    const entity = this.getFieldEntity(namePath)
    return entity ? entity.getErrors() : []
  }

  public getFieldData = (name: InternalNamePath): FieldData => {
    const entity = this.getFieldEntity(name)
    return {
      name,
      value: this.getFieldValue(name),
      touched: this.isFieldTouched(name),
      validating: entity?.isFieldValidating() || false,
      errors: entity?.getErrors() || [],
    }
  }

  public isFieldsTouched = (nameList?: NamePath[]): boolean => {
    if (!nameList) {
      // Check if any field stored is different from initial
      // Note: This is a simplified check. Only checks registered fields for now
      // or we'd need deep comparison of store vs initialValues
      return this.fieldEntities.some((entity) => {
        const namePath = entity.getNamePath()
        const value = getValue(this.store, namePath)
        const initValue = getValue(this.initialValues, namePath)
        return value !== initValue
      })
    }
    return nameList.some((name) => {
      const namePath = getNamePath(name)
      const value = getValue(this.store, namePath)
      const initValue = getValue(this.initialValues, namePath)
      return value !== initValue
    })
  }

  public isFieldTouched = (name: NamePath): boolean => {
    return this.isFieldsTouched([name])
  }

  public isFieldValidating = (name?: NamePath): boolean => {
    if (name) {
      const namePath = getNamePath(name)
      const entity = this.getFieldEntity(namePath)
      return entity?.isFieldValidating() || false
    }
    return this.fieldEntities.some((entity) => entity.isFieldValidating())
  }

  public notifyFieldChange = (namePath: InternalNamePath) => {
    if (this.callbacks.onFieldsChange) {
      const changedField = this.getFieldData(namePath)
      const allFields = this.fieldEntities
        .map((entity) => {
          const entityName = entity.getNamePath()
          return entityName ? this.getFieldData(entityName) : null
        })
        .filter((item): item is FieldData => item !== null)

      this.callbacks.onFieldsChange([changedField], allFields)
    }
  }

  public resetFields = (nameList?: NamePath[]) => {
    // 1. Get fields to reset
    const fieldsToReset =
      nameList?.map(getNamePath) ||
      this.fieldEntities.map((e) => e.getNamePath()).filter((n) => !!n && n.length > 0)

    // 2. Reset store values
    fieldsToReset.forEach((namePath) => {
      const initialValue = getValue(this.initialValues, namePath)
      this.store = setValue(this.store, namePath, initialValue)

      // Reset errors
      const entity = this.getFieldEntity(namePath)
      if (entity) {
        entity.setErrors([])
      }
    })

    // 3. Notify changes
    fieldsToReset.forEach((namePath) => {
      this.notify(namePath)
    })
  }

  public setFieldValue = (name: NamePath, value: unknown) => {
    const namePath = getNamePath(name)
    const prevValue = getValue(this.store, namePath)

    if (prevValue !== value) {
      this.store = setValue(this.store, namePath, value)
      this.notify(namePath)

      // Notify onValuesChange
      if (this.callbacks.onValuesChange) {
        this.callbacks.onValuesChange({ [namePath.join('.')]: value }, this.store)
      }
    }
  }

  public setFields = (fields: FieldData[]) => {
    fields.forEach((field) => {
      const { name, value, errors } = field
      const namePath = getNamePath(name)

      if (value !== undefined) {
        this.store = setValue(this.store, namePath, value)
      }
      if (errors !== undefined) {
        const entity = this.getFieldEntity(namePath)
        if (entity) {
          entity.setErrors(errors)
        }
      }
      this.notify(namePath)
    })

    if (this.callbacks.onValuesChange) {
      // Create a partial store for changed values
      // Note: This constructs a flat object with string keys for now as a simple representation
      // Ideally it should be a deep object matching the structure
      fields.forEach(({ value }) => {
        if (value !== undefined) {
          // For simplicity in onValuesChange param, we might just use dot notation or similar
          // But strict Store type expects Record<string, StoreValue>
          // Let's just put it under the first key if it's simple, or reconstruct object
          // For now, let's keep it simple:
          this.callbacks.onValuesChange?.(this.store, this.store)
        }
      })
    }
  }

  public setFieldsValue = (values: Store) => {
    // values is a deep object (RecursivePartial<Values>), but typed as Store (Record<string, unknown>) in signature for simplicity?
    // Actually setFieldsValue expects a deep object usually.
    // Let's assume values is an object structure that mirrors store.

    // Deep merge or recursive set needed.
    // For simplicity, let's assume `values` is the new store state branch for the keys provided.
    // We can iterate keys of values and update store.

    // Simplest recursive merge:
    const updateStore = (current: StoreValue, path: InternalNamePath = []) => {
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        Object.keys(current as object).forEach((key) => {
          updateStore((current as Record<string, StoreValue>)[key], [...path, key])
        })
      } else {
        // leaf value
        if (path.length > 0) {
          this.store = setValue(this.store, path, current)
          this.notify(path)
        }
      }
    }

    updateStore(values)

    if (this.callbacks.onValuesChange) {
      this.callbacks.onValuesChange(values, this.store)
    }
  }

  public registerField = (entity: FieldEntity) => {
    this.fieldEntities.push(entity)

    // Set initial value if present in store/initialValues
    const namePath = entity.getNamePath()
    const initialValue = getValue(this.initialValues, namePath)
    const storeValue = getValue(this.store, namePath)

    if (namePath.length > 0 && initialValue !== undefined && storeValue === undefined) {
      this.store = setValue(this.store, namePath, initialValue)
    }

    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity)
    }
  }

  public registerWatch = (callback: (namePath: InternalNamePath) => void) => {
    this.watchList.push(callback)
    return () => {
      this.watchList = this.watchList.filter((fn) => fn !== callback)
    }
  }

  private notify = (namePath: InternalNamePath) => {
    this.fieldEntities.forEach((entity) => {
      const { dependencies } = entity.props
      const entityName = entity.getNamePath()

      if (matchNamePath(entityName, namePath)) {
        entity.onStoreChange()
      } else if (dependencies) {
        // Trigger validation for dependent fields only if the field has been touched
        // Check if any dependency matches the changed namePath
        const isDependent = dependencies.some((dep) => {
          // Check if dependency path contains or equals the changed path
          // For example if dependency is ['user'] and changed is ['user', 'name'], it should trigger
          const depPath = getNamePath(dep)
          return (
            matchNamePath(depPath, namePath) ||
            (namePath.length > depPath.length &&
              matchNamePath(namePath.slice(0, depPath.length), depPath))
          )
        })

        if (isDependent && entity.isFieldTouched()) {
          entity.validateRules()
        }
      }
    })

    this.watchList.forEach((callback) => callback(namePath))
  }

  private getFieldEntity = (namePath: InternalNamePath): FieldEntity | undefined => {
    return this.fieldEntities.find((e) => matchNamePath(e.getNamePath(), namePath))
  }

  public setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  public validateFields = async (nameList?: NamePath[]) => {
    const values = this.getFieldsValue()
    const promiseList: Promise<string[] | null>[] = []

    this.fieldEntities.forEach((entity) => {
      const namePath = entity.getNamePath()
      // Skip if no name (e.g. pure layout wrapper)
      if (!namePath.length) return

      if (!nameList || containsNamePath(nameList, namePath)) {
        promiseList.push(entity.validateRules())
      }
    })

    const results = await Promise.all(promiseList)
    const hasError = results.some((r) => Array.isArray(r) && r.length > 0)

    if (!hasError) {
      return values
    }

    const errorFields: FieldError[] = this.fieldEntities
      .map((entity) => {
        const namePath = entity.getNamePath()
        if (!namePath.length) return null
        const errors = entity.getErrors()
        return errors.length > 0 ? { name: namePath, errors } : null
      })
      .filter((item): item is FieldError => item !== null)

    const errorEntity: ValidateErrorEntity = {
      values,
      errorFields,
      outOfDate: false,
    }

    // eslint-disable-next-line no-throw-literal
    throw errorEntity
  }

  public setInitialValues = (initialValues: Store, init: boolean) => {
    this.initialValues = initialValues || {}
    if (init) {
      this.store = { ...this.initialValues }
      this.fieldEntities.forEach((entity) => {
        entity.onStoreChange()
      })
      if (this.forceRootUpdate) {
        this.forceRootUpdate({})
      }
    }
  }

  public submit = () => {
    this.validateFields()
      .then((values) => {
        if (this.callbacks.onFinish) {
          this.callbacks.onFinish(values)
        }
      })
      .catch((errorInfo: ValidateErrorEntity) => {
        if (this.callbacks.onFinishFailed) {
          this.callbacks.onFinishFailed(errorInfo)
        }
      })
  }
}
