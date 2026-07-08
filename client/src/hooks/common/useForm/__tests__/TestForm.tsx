import { Fragment, useState } from "react";
import { useForm } from "..";
import { schema } from "./schema";
import type { InferType } from "yup";

type Values = InferType<typeof schema>;

const hobbies = ["reading", "movies", "cycling", "running", "cooking"];
const titles = ["Mr", "Mrs", "Miss"];

export const TestForm = () => {
  const [values, setValues] = useState<Values | null>(null);
  const { errors, handleSubmit, register } = useForm({
    schema,
    onSubmit(values) {
      setTimeout(() => setValues(values), 200);
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        encType="multipart/form-data"
        noValidate
      >
        <label htmlFor="name">Name</label>
        <input
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-errormessage={errors.name ? "name-error" : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p id="name-error">{errors.name}</p>}

        <label htmlFor="age">Age</label>
        <input
          {...register("age")}
          type="number"
          aria-invalid={!!errors.age}
          aria-errormessage={errors.age ? "age-error" : undefined}
          aria-describedby={errors.age ? "age-error" : undefined}
        />
        {errors.age && <p id="age-error">{errors.age}</p>}

        <label htmlFor="email">E-mail</label>
        <input
          {...register("email")}
          type="email"
          aria-invalid={!!errors.email}
          aria-errormessage={errors.email ? "email-error" : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <p id="email-error">{errors.email}</p>}

        <fieldset
          aria-invalid={!!errors.title}
          aria-errormessage={errors.title ? "title-error" : undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
        >
          <legend>Select Title</legend>
          {titles.map(title => (
            <Fragment key={title}>
              <label htmlFor={title}>{title}</label>
              <input
                {...register("title")}
                id={title}
                type="radio"
                value={title}
              />
            </Fragment>
          ))}
        </fieldset>
        {errors.title && <p id="title-error">{errors.title}</p>}

        <fieldset
          aria-invalid={!!errors.hobbies}
          aria-errormessage={errors.hobbies ? "hobbies-error" : undefined}
          aria-describedby={errors.hobbies ? "hobbies-error" : undefined}
        >
          <legend>Select your hobbies</legend>
          {hobbies.map(hobby => (
            <Fragment key={hobby}>
              <input
                {...register("hobbies")}
                id={hobby}
                type="checkbox"
                value={hobby}
              />
              <label htmlFor={hobby}>{hobby}</label>
            </Fragment>
          ))}
        </fieldset>
        {errors.hobbies && <p id="hobbies-error">{errors.hobbies}</p>}

        <label htmlFor="avatar">Avatar</label>
        <input
          {...register("avatar")}
          type="file"
          accept="image/*"
          aria-invalid={!!errors.avatar}
          aria-errormessage={errors.avatar ? "avatar-error" : undefined}
          aria-describedby={errors.avatar ? "avatar-error" : undefined}
        />
        {errors.avatar && <p id="avatar-error">{errors.avatar}</p>}
        <input type="submit" value="Submit" />
      </form>
      {values && (
        <article aria-label="form values">
          <p>
            Name is {values.title} {values.name}
          </p>
          <p>Age is {values.age}</p>
          <p>E-mail address is {values.email}</p>
          <p>Hobbies are {values.hobbies.join(", ")}</p>
        </article>
      )}
    </>
  );
};
