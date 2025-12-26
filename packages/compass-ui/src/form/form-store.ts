import React from 'react'
import {
  Store,
  FieldEntity,
  Callbacks,
  ValidateErrorEntity,
  FieldError,
  StoreValue,
  FieldData,
} from './types'

export class FormStore {
  private store: Store = {}
  private fieldEntities: FieldEntity[] = []
  private watchList: ((name: string) => void)[] = []
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

  public getFieldValue = (name: string): StoreValue => {
    return this.store[name]
  }

  public getFieldsValue = (): Store => {
    return { ...this.store }
  }

  public getFieldError = (name: string): string[] => {
    const entity = this.getFieldEntity(name)
    return entity ? entity.getErrors() : []
  }

  public getFieldData = (name: string): FieldData => {
    const entity = this.getFieldEntity(name)
    return {
      name,
      value: this.getFieldValue(name),
      touched: this.isFieldTouched(name),
      validating: entity?.isFieldValidating() || false,
      errors: entity?.getErrors() || [],
    }
  }

  public isFieldsTouched = (nameList?: string[]): boolean => {
    // Basic implementation: check if store value is different from initial
    // In a full implementation, we'd track touched state separately
    if (!nameList) {
      return Object.keys(this.store).some((key) => this.store[key] !== this.initialValues[key])
    }
    return nameList.some((name) => this.store[name] !== this.initialValues[name])
  }

  public isFieldTouched = (name: string): boolean => {
    return this.isFieldsTouched([name])
  }

  public isFieldValidating = (name?: string): boolean => {
    if (name) {
      const entity = this.getFieldEntity(name)
      return entity?.isFieldValidating() || false
    }
    return this.fieldEntities.some((entity) => entity.isFieldValidating())
  }

  public notifyFieldChange = (name: string) => {
    if (this.callbacks.onFieldsChange) {
      const changedField = this.getFieldData(name)
      const allFields = this.fieldEntities
        .map((entity) => {
          const entityName = entity.getName()
          return entityName ? this.getFieldData(entityName) : null
        })
        .filter((item): item is FieldData => item !== null)

      this.callbacks.onFieldsChange([changedField], allFields)
    }
  }

  public resetFields = (nameList?: string[]) => {
    const nextStore = { ...this.store }
    const fieldsToReset = nameList || this.fieldEntities.map((e) => e.getName()).filter((n) => !!n)

    fieldsToReset.forEach((name) => {
      nextStore[name] = this.initialValues[name]
      // Reset errors
      const entity = this.getFieldEntity(name)
      if (entity) {
        entity.setErrors([])
      }
    })

    this.store = nextStore
    fieldsToReset.forEach((name) => {
      this.notify(name)
    })
  }

  public setFieldValue = (name: string, value: unknown) => {
    if (this.store[name] !== value) {
      this.store[name] = value
      this.notify(name)

      // Notify onValuesChange
      if (this.callbacks.onValuesChange) {
        this.callbacks.onValuesChange({ [name]: value }, this.store)
      }
    }
  }

  public setFields = (fields: FieldData[]) => {
    fields.forEach((field) => {
      const { name, value, errors } = field
      if (value !== undefined) {
        this.store[name] = value
      }
      if (errors !== undefined) {
        const entity = this.getFieldEntity(name)
        if (entity) {
          entity.setErrors(errors)
        }
      }
      this.notify(name)
    })

    if (this.callbacks.onValuesChange) {
      // Create a partial store for changed values
      const changedValues: Store = {}
      fields.forEach(({ name, value }) => {
        if (value !== undefined) {
          changedValues[name] = value
        }
      })
      this.callbacks.onValuesChange(changedValues, this.store)
    }
  }

  public setFieldsValue = (values: Store) => {
    const nextStore = { ...this.store, ...values }
    this.store = nextStore

    Object.keys(values).forEach((name) => {
      this.notify(name)
    })

    if (this.callbacks.onValuesChange) {
      this.callbacks.onValuesChange(values, this.store)
    }
  }

  public registerField = (entity: FieldEntity) => {
    this.fieldEntities.push(entity)

    // Set initial value if present in store/initialValues
    const name = entity.getName()
    if (name && this.initialValues[name] !== undefined && this.store[name] === undefined) {
      this.store[name] = this.initialValues[name]
    }

    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity)
    }
  }

  public registerWatch = (callback: (name: string) => void) => {
    this.watchList.push(callback)
    return () => {
      this.watchList = this.watchList.filter((fn) => fn !== callback)
    }
  }

  private notify = (name: string) => {
    this.fieldEntities.forEach((entity) => {
      if (entity.getName() === name) {
        entity.onStoreChange()
      }
    })

    this.watchList.forEach((callback) => callback(name))
  }

  private getFieldEntity = (name: string): FieldEntity | undefined => {
    return this.fieldEntities.find((e) => e.getName() === name)
  }

  public setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  public validateFields = async (nameList?: string[]) => {
    const values = this.getFieldsValue()
    const promiseList: Promise<string[] | null>[] = []

    this.fieldEntities.forEach((entity) => {
      const name = entity.getName()
      // Skip if no name (e.g. pure layout wrapper)
      if (!name) return

      if (!nameList || nameList.includes(name)) {
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
        const name = entity.getName()
        if (!name) return null
        const errors = entity.getErrors()
        return errors.length > 0 ? { name, errors } : null
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
