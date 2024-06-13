import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// const schema = yup.object({
//     fullName: yup.string().required().min(3).max(50),
//     age: yup.number().required().positive().integer().min(18).max(100),
//     email: yup.string().required().email(),
//     country: yup.string().required(),
//     password: yup.string().required(),
// });

const Form = () => {
    const [isLoading, setIsLoading] = useState(true);

    const { register, handleSubmit, formState, reset } = useForm({
        mode: "onBlur",
        // resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            const response = await fetch("https://jsonplaceholder.typicode.com/users/10");
            const user = await response.json();
            reset({
                fullName: user.name,
                age: parseInt(Math.random() * 10),
                email: user.email,
                country: user.address.city, // Adjusted since country field does not exist in the JSON response
            });
            setIsLoading(false);
        };

        fetchUser();
    }, [reset]);

    const { errors, isSubmitted, isValid, isDirty, submitCount } = formState;

    const submitForm = (data) => {
        console.log(data);
    };

    return (
        <>
            {isLoading ? (
               <div>Loading</div>
            ) : (
                <>
                    {submitCount > 3 ? (
                        <div className="alert alert-danger" role="alert">
                            <strong>You are locked</strong>
                        </div>
                    ) : (
                        <>
                            {isSubmitted && isValid && (
                                <div className="alert alert-primary" role="alert">
                                    <strong>Form is submitted</strong>
                                </div>
                            )}
                            <h2 className="display-6 text-primary">Create user</h2>
                            <hr className="text-primary" />
                            <form onSubmit={handleSubmit(submitForm)}>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        {...register("fullName", {
                                            required: true,
                                            minLength: 3,
                                            maxLength: 50,
                                        })}
                                    />
                                    {errors.fullName && (
                                        <span className="text-danger">Full name is invalid</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        {...register("age", {
                                            required: true,
                                            valueAsNumber: true,
                                            min: 18,
                                            max: 100,
                                            validate: (value) => {
                                                if (isNaN(value)) {
                                                    return "Age must be a number";
                                                }
                                            },
                                        })}
                                    />
                                    {errors.age && <span className="text-danger">Age is invalid</span>}
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        {...register("password", {
                                            validate: (value, formValue) => {
                                                if (value.length < 8) {
                                                    return "Password must be at least 8 characters";
                                                } else if (value === formValue.fullName) {
                                                    return "Password must be different from full name";
                                                } else if (value === formValue.age) {
                                                    return "Password must be different from age";
                                                } else if (value === formValue.email) {
                                                    return "Password must be different from email";
                                                }
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <span className="text-danger">{errors.password.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        {...register("email", {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="text-danger">Email is invalid</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Country</label>
                                    <select className="form-select" {...register("country")}>
                                        <option value="">Select your country</option>
                                        <option value="MA">Morocco</option>
                                        <option value="DZ">Algeria</option>
                                        <option value="TN">Tunisia</option>
                                    </select>
                                </div>

                                <div className="my-3">
                                    <input
                                        disabled={!isValid || !isDirty}
                                        className="btn btn-primary bg-red"
                                        type="submit"
                                        value="Submit"
                                    />
                                </div>
                            </form>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Form;
