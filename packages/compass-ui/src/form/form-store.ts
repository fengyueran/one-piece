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
  ValidateFieldsOptions,
} from './types'
import {
  applyStoreValues,
  buildFlatChangedValues,
  containsNamePath,
  getNamePath,
  getValue,
  isRelatedNamePath,
  matchNamePath,
  setValue,
} from './utils'

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
      this.callbacks.onFieldsChange([changedField], this.getAllFieldData())
    }
  }

  public resetFields = (nameList?: NamePath[]) => {
    const fieldsToReset =
      nameList?.map(getNamePath) ||
      this.getNamedFieldEntities().map((entity) => entity.getNamePath())

    fieldsToReset.forEach((namePath) => {
      const initialValue = getValue(this.initialValues, namePath)
      this.store = setValue(this.store, namePath, initialValue)
      this.setFieldErrors(namePath, [])
    })

    fieldsToReset.forEach((namePath) => {
      this.notify(namePath)
      this.notifyFieldChange(namePath)
    })
  }

  public setFieldValue = (name: NamePath, value: unknown) => {
    const namePath = getNamePath(name)
    const prevValue = getValue(this.store, namePath)

    if (prevValue !== value) {
      this.store = setValue(this.store, namePath, value)
      this.notify(namePath)
      this.notifyFieldChange(namePath)

      if (this.callbacks.onValuesChange) {
        this.callbacks.onValuesChange(buildFlatChangedValues(this.store, [namePath]), this.store)
      }
    }
  }

  public setFields = (fields: FieldData[]) => {
    const changedValueFields: InternalNamePath[] = []

    fields.forEach((field) => {
      const { name, value, errors } = field
      const namePath = getNamePath(name)

      if (value !== undefined) {
        this.store = setValue(this.store, namePath, value)
        changedValueFields.push(namePath)
      }
      if (errors !== undefined) {
        this.setFieldErrors(namePath, errors)
      }
      this.notify(namePath)
      this.notifyFieldChange(namePath)
    })

    if (this.callbacks.onValuesChange && changedValueFields.length > 0) {
      this.callbacks.onValuesChange(
        buildFlatChangedValues(this.store, changedValueFields),
        this.store,
      )
    }
  }

  public setFieldsValue = (values: Store) => {
    const { store, changedPaths } = applyStoreValues(this.store, values)
    this.store = store
    changedPaths.forEach((namePath) => {
      this.notify(namePath)
      this.notifyFieldChange(namePath)
    })

    if (this.callbacks.onValuesChange) {
      this.callbacks.onValuesChange(values, this.store)
    }
  }

  public registerField = (entity: FieldEntity) => {
    this.fieldEntities.push(entity)

    const namePath = entity.getNamePath()
    const initialValue = getValue(this.initialValues, namePath)
    const storeValue = getValue(this.store, namePath)

    if (namePath.length > 0 && initialValue !== undefined && storeValue === undefined) {
      this.store = setValue(this.store, namePath, initialValue)
    }

    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity)

      if (namePath.length > 0) {
        queueMicrotask(() => {
          if (!this.getFieldEntity(namePath)) {
            this.notifyFieldChange(namePath)
          }
        })
      }
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
      const entityName = entity.getNamePath()

      if (matchNamePath(entityName, namePath)) {
        entity.onStoreChange()
      } else if (this.shouldValidateDependency(entity, namePath)) {
        entity.validateRules()
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

  private parseValidateFieldsArgs = (
    nameListOrOptions?: NamePath[] | ValidateFieldsOptions,
    options?: ValidateFieldsOptions,
  ): { nameList?: NamePath[]; validateOnly: boolean } => {
    if (
      nameListOrOptions &&
      !Array.isArray(nameListOrOptions) &&
      typeof nameListOrOptions === 'object'
    ) {
      return {
        nameList: undefined,
        validateOnly: !!nameListOrOptions.validateOnly,
      }
    }

    return {
      nameList: nameListOrOptions as NamePath[] | undefined,
      validateOnly: !!options?.validateOnly,
    }
  }

  public validateFields = async (
    nameListOrOptions?: NamePath[] | ValidateFieldsOptions,
    options?: ValidateFieldsOptions,
  ) => {
    const { nameList, validateOnly } = this.parseValidateFieldsArgs(nameListOrOptions, options)
    const values = this.getFieldsValue()
    const validateTaskList: { name: InternalNamePath; promise: Promise<string[] | null> }[] = []

    this.fieldEntities.forEach((entity) => {
      const namePath = entity.getNamePath()
      // Skip if no name (e.g. pure layout wrapper)
      if (!namePath.length) return

      if (!nameList || containsNamePath(nameList, namePath)) {
        validateTaskList.push({
          name: namePath,
          promise: entity.validateRules({ validateOnly }),
        })
      }
    })

    const results = await Promise.all(validateTaskList.map((task) => task.promise))
    const errorFields: FieldError[] = results
      .map((errors, index) => {
        if (!errors || errors.length === 0) return null
        return {
          name: validateTaskList[index].name,
          errors,
        }
      })
      .filter((item): item is FieldError => item !== null)

    if (errorFields.length === 0) {
      return values
    }

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

  private getNamedFieldEntities = (): FieldEntity[] => {
    return this.fieldEntities.filter((entity) => entity.getNamePath().length > 0)
  }

  private getAllFieldData = (): FieldData[] => {
    return this.getNamedFieldEntities().map((entity) => this.getFieldData(entity.getNamePath()))
  }

  private setFieldErrors = (namePath: InternalNamePath, errors: string[]) => {
    const entity = this.getFieldEntity(namePath)
    entity?.setErrors(errors)
  }

  private shouldValidateDependency = (
    entity: FieldEntity,
    changedNamePath: InternalNamePath,
  ): boolean => {
    if (!entity.isFieldTouched() || !entity.props.dependencies?.length) {
      return false
    }

    return entity.props.dependencies.some((dependency) => {
      return isRelatedNamePath(getNamePath(dependency), changedNamePath)
    })
  }
}
