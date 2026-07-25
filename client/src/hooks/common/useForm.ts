import { useRef, useState } from "react";
import { type InferType, type AnyObjectSchema, ValidationError } from "yup";

type FormErrors<T extends AnyObjectSchema> = Partial<
  Record<keyof InferType<T> & string, string>
>;

interface OnSubmitOptions<T extends AnyObjectSchema> {
  setErrors: (errorObject: FormErrors<T>) => void;
}

interface UseFormProps<T extends AnyObjectSchema> {
  schema: T;
  onSubmit: (
    values: InferType<T>,
    options: OnSubmitOptions<T>
  ) => Promise<void> | void;
}

const normalizeFormData = (formData: FormData): Record<string, unknown> => {
  const values: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    // TODO: Convert string numbers to actual numbers here
    // in order to eliminate the need for second iteration below

    if (!(key in values)) {
      values[key] = value;
    } else if (Array.isArray(values[key])) {
      values[key].push(value);
    } else {
      values[key] = [values[key], value];
    }
  });

  // Convert string numbers to actual numbers
  Object.entries(values).forEach(([key, value]) => {
    if (
      typeof value === "string" &&
      value !== "" &&
      !Number.isNaN(Number(value))
    ) {
      values[key] = Number(value);
    }
  });

  return values;
};

export const useForm = <T extends AnyObjectSchema>(props: UseFormProps<T>) => {
  const { schema, onSubmit } = props;
  const [errors, handleErrors] = useState<FormErrors<T>>({});
  const hasSubmitted = useRef(false);

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    if (!hasSubmitted.current) return;

    const { name } = e.target;
    const { form } = e.currentTarget;

    if (!form) return;

    const values = normalizeFormData(new FormData(form));

    schema.validateAt(name, values).catch((err: unknown) => {
      if (err instanceof ValidationError) {
        handleErrors(prev => ({ ...prev, [name]: err.message }));
      }
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    if (errors[name]) {
      handleErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const register = <Q extends keyof InferType<T> & string>(name: Q) => ({
    id: name.replace(/[A-Z]/g, "-$&").toLowerCase(),
    name,
    onBlur: handleBlur,
    onFocus: handleFocus,
  });

  const setErrors = (errorObject: FormErrors<T>) => {
    handleErrors(prev => ({ ...prev, ...errorObject }));
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    hasSubmitted.current = true;

    const formData = new FormData(e.currentTarget);
    const values = normalizeFormData(formData);

    (async () => {
      try {
        const data = await schema.validate(values, { abortEarly: false });
        await onSubmit(data, { setErrors });
      } catch (err) {
        if (err instanceof ValidationError) {
          let nextErrors: FormErrors<T> = {};

          err.inner.forEach(({ message, path }) => {
            if (!path) return;
            nextErrors = { ...nextErrors, [path]: message };
          });

          handleErrors(nextErrors);
        }
      }
    })();
  };

  return { errors, handleSubmit, register };
};
