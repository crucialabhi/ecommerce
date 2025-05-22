import Joi from "joi";

//Validation Of User In Signup
export const validaterUserInJoi = async (user) => {
  const JoiSchema = Joi.object({
    first_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `First name can't be empty`,
        "string.min": `First name should be greater than 4`,
      })
      .required(),

    last_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `Last name can't be empty`,
        "string.min": `Last name should be greater than 4`,
      })
      .required(),

    contact: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": `Phone number must have 10 digits.`,
        "string.empty": `Phone number Can't be empty`,
      })
      .required(),

    email: Joi.string()
      .email()
      .messages({
        "string.email": `Give proper email in the xyz@gmail.com format`,
      })
      .required(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(user);
};

//Validation Of Product data In Vendor add product form
export const validateVendorProduct = async (product) => {
  const JoiSchema = Joi.object({
    title: Joi.string()
      .messages({
        "string.empty": `Title can't be empty`,
      })
      .required(),

    description: Joi.string()
      .messages({
        "string.empty": `Description can't be empty`,
      })
      .required(),

    color: Joi.string()
      .messages({
        "string.empty": `Color can't be empty`,
      })
      .required(),

    stock: Joi.string()
      .messages({
        "string.empty": `Stock can't be empty`,
      })
      .required(),

    price: Joi.string()
      .messages({
        "string.empty": `Price can't be empty`,
      })
      .required(),

    category: Joi.string()
      .messages({
        "string.empty": `Category can't be empty`,
      })
      .required(),

    subCategory1: Joi.string()
      .messages({
        "string.empty": `Subcategory1 can't be empty`,
      })
      .required(),

    subCategory2: Joi.string()
      .messages({
        "string.empty": `Subcategory2 can't be empty`,
      })
      .required(),

    subCategory3: Joi.string()
      .messages({
        "string.empty": `Subcategory3 can't be empty`,
      })
      .required(),

    size: Joi.string()
    .messages({
      "string.empty": `Size can't be empty`,
    })
    .required(), 

  }).options({ abortEarly: false });
  return JoiSchema.validate(product);
};

//Validation Of User In Signup
export const validateUserInJoi = async (user) => {
  const JoiSchema = Joi.object({
    first_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `First name can't be empty`,
        "string.min": `First name should be greater than 4`,
      })
      .required(),

    last_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `Last name can't be empty`,
        "string.min": `Last name should be greater than 4`,
      })
      .required(),

    contact: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": `Phone number must have 10 digits.`,
        "string.empty": `Phone number Can't be empty`,
      })
      .required(),

    email: Joi.string()
      .email()
      .messages({
        "string.email": `Give proper email in the xyz@gmail.com format`,
      })
      .required(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(user);
};
//validating the  vendor details
export const validateVendorInJoi = async (user) => {
  const JoiSchema = Joi.object({
    first_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `First name can't be empty`,
        "string.min": `First name should be greater than 4`,
      })
      .required(),

    last_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `Last name can't be empty`,
        "string.min": `Last name should be greater than 4`,
      })
      .required(),

    contact: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": `Phone number must have 10 digits.`,
        "string.empty": `Phone number Can't be empty`,
      })
      .required(),

    email: Joi.string()
      .email()
      .messages({
        "string.email": `Give proper email in the xyz@gmail.com format`,
      })
      .required(),

    company_name: Joi.string()
      .min(4)
      .messages({
        "string.empty": `company name can't be empty`,
        "string.min": `company name should be greater than 4`,
      })
      .required(),

    gst_number: Joi.string()
      .min(11)
      .messages({
        "string.empty": `gst number  can't be empty`,
        "string.min": `gst number  should be greater than 12`,
      })
      .required(),

    pincode: Joi.string()
      .min(6)
      .max(6)
      .regex(/^[0-9]{6}$/)
      .messages({
        "string.pattern.base": `It should contain onlu number`,
        "string.empty": `Pincode can't be empty`,
        "string.min": `pincode should be of 6 digit`,
        "string.max": `pincode should be of 6 digit`,
      })
      .required(),

    State: Joi.string()
      .messages({
        "string.empty": `select proper State`,
      })
      .required(),

    City: Joi.string()
      .messages({
        "string.empty": `select proper City`,
      })
      .required(),

    category: Joi.string()
      .messages({
        "string.empty": `select proper Category`,
      })
      .required(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(user);
};

//validation for login
export const validateLogin = async (user) => {
  const JoiSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(user);
};

export const userAddressSchema = Joi.object({
  address: Joi.string().required().messages({
    "string.empty": `Address cannot be empty`,
  }),
  pin_code: Joi.string().required().messages({
    "string.empty": `Pincode cannot be empty`,
  }),
  city: Joi.string().required().messages({
    "string.empty": `City cannot be empty`,
  }),
  state: Joi.string().required().messages({
    "string.empty": `State cannot be empty`,
  })
})

export const updateProfileSchema = Joi.object({
  first_name: Joi.string()
    .min(4)
    .messages({
      "string.empty": `First name can't be empty`,
      "string.min": `First name should be greater than 4`,
    })
    .required(),

  last_name: Joi.string()
    .min(4)
    .messages({
      "string.empty": `Last name can't be empty`,
      "string.min": `Last name should be greater than 4`,
    })
    .required(),

  contact: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": `Phone number must have 10 digits.`,
      "string.empty": `Phone number Can't be empty`,
    })
    .required()
})


export const validateVendorProfileDetails = async (ProfileDetails) => {
  const JoiSchema = Joi.object({
    fname: Joi.string()
      .min(4)
      .messages({
        "string.empty": `First name can't be empty`,
        "string.min": `First name should be greater than 4`,
      })
      .required(),

    lname: Joi.string()
      .min(4)
      .messages({
        "string.empty": `Last name can't be empty`,
        "string.min": `Last name should be greater than 4`,
      })
      .required(),

      MobileNum: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": `Phone number must have 10 digits.`,
        "string.empty": `Phone number Can't be empty`,
      })
      .required(),

      companyName: Joi.string()
      .min(4)
      .messages({
        "string.empty": `company name can't be empty`,
        "string.min": `company name should be greater than 4`,
      })
      .required(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(ProfileDetails);
};
