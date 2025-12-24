import React from 'react'
import { Store, FieldEntity, Callbacks, ValidateErrorEntity, FieldError, StoreValue } from './types'

export class FormStore {
  private store: Store = {}
  private fieldEntities: FieldEntity[] = []
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

  public isFieldValidating = (): boolean => {
    // Placeholder: We need to track validating state in FormItem or here
    return false
  }

  public resetFields = (nameList?: string[]) => {
    const nextStore = { ...this.store }
    const fieldsToReset = nameList || Object.keys(this.store)

    fieldsToReset.forEach((name) => {
      nextStore[name] = this.initialValues[name]
      // Also notify to reset errors/touched state if managed by item
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

  private notify = (name: string) => {
    this.fieldEntities.forEach((entity) => {
      if (entity.getName() === name) {
        entity.onStoreChange()
      }
    })
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
      // Important: notify all registered fields so they re-render with latest store,
      // even if parent props children identity doesn't change (e.g. when Form owns the store).
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
