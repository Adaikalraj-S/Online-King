// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Users"];

const {
  user_controllers,
  customers_enquiry_controller,
} = require("../controllers");
const {
  usersValidation,
  headerValidator,
  getAccessTokenHeaderValidator,
  customersEnquiryPayload,
} = require("../validators");

const user_routes = [
  {
    method: "GET",
    path: "/verify-token",
    options: {
      description: "Verify token",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: user_controllers.verifyToken,
    },
  },
  {
    method: "GET",
    path: "/fetch-roles",
    options: {
      description: "Fetch Roles",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: user_controllers.getRole,
    },
  },
  {
    method: "POST",
    path: "/edit-customer-details",
    options: {
      description: "Edit customer details.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true, // <-- this fixed the media type error
      },
      validate: {
        headers: headerValidator,
        payload: usersValidation.edit_user_details,
      },
      handler: user_controllers.editCustomerDetails,
    },
  },
  {
    method: "GET",
    path: "/fetch-customers",
    options: {
      description: "Fetch all customers for admin.",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: user_controllers.getUser,
    },
  },
  {
    method: "GET",
    path: "/fetch-dealers",
    options: {
      description: "Fetch all Dealers for admin.",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: user_controllers.getDealers,
    },
  },
  {
    method: "POST",
    path: "/add-admin",
    options: {
      description: "Create a new admin. requires admin privileges.",
      tags,
      validate: {
        headers: headerValidator,
        payload: usersValidation.admin_add_payload,
      },
      handler: user_controllers.addNewAdmin,
    },
  },
  {
    method: "POST",
    path: "/login-admin",
    options: {
      description: "Login as admin.",
      tags,
      validate: {
        payload: usersValidation.admin_login_payload,
      },
      handler: user_controllers.adminLogin,
    },
  },
  {
    method: "POST",
    path: "/register-customer-dealer",
    options: {
      description: "Registration of a new customer or Dealer.",
      tags,
      validate: {
        query: usersValidation.customer_registration_query,
        payload: usersValidation.customer_registration_payload,
      },
      handler: user_controllers.registerCustomer,
    },
  },
  {
    method: "POST",
    path: "/verify-otp-customer-dealer",
    options: {
      description: "Verify of a new customer or Dealer.",
      tags,
      validate: {
        query: usersValidation.customer_registration_query,
        payload: usersValidation.customer_registration_otp_validation_payload,
      },
      handler: user_controllers.verifyUser,
    },
  },
  {
    method: "POST",
    path: "/send-otp-forgot-password",
    options: {
      description: "Forgot Password for customer or Dealer.",
      tags,
      validate: {
        query: usersValidation.customer_registration_query,
        payload: usersValidation.forgot_password_payload,
      },
      handler: user_controllers.forgotPassword,
    },
  },
  {
    method: "POST",
    path: "/verify-forgot-password",
    options: {
      description: "Verify and add new password for customer or Dealer.",
      tags,
      validate: {
        query: usersValidation.customer_registration_query,
        payload: usersValidation.verify_forgot_password_payload,
      },
      handler: user_controllers.verifyOtpAndUpdatePassword,
    },
  },
  {
    method: "POST",
    path: "/approve-dealer",
    options: {
      description: "Approver Dealer for admins.",
      tags,
      validate: {
        headers: headerValidator,
        query: usersValidation.approve_dealer_payload,
      },
      handler: user_controllers.approveDealerIds,
    },
  },
  {
    method: "POST",
    path: "/reject-dealer",
    options: {
      description: "Reject Dealer for admins.",
      tags,
      validate: {
        headers: headerValidator,
        payload: usersValidation.dealer_reject_validator,
      },
      handler: user_controllers.rejectDealerIds,
    },
  },
  {
    method: "POST",
    path: "/active-inactive-dealer",
    options: {
      description: "Change status of Dealer for admins.",
      tags,
      validate: {
        headers: headerValidator,
        query: usersValidation.status_change_dealer_payload,
      },
      handler: user_controllers.toggleDealerIsActive,
    },
  },
  {
    method: "POST",
    path: "/login-user-dealer",
    options: {
      description: "Login as customer or Dealer.",
      tags,
      validate: {
        query: usersValidation.customer_registration_query,
        payload: usersValidation.customer_login_payload,
      },
      handler: user_controllers.customerLogin,
    },
  },
  {
    method: "POST",
    path: "/dealer-personal-details",
    options: {
      description: "Add personal details of a Dealer.",
      tags,
      validate: {
        payload: usersValidation.dealer_personal_details_payload,
      },
      handler: user_controllers.addDealerPersonalData,
    },
  },
  {
    method: "GET",
    path: "/fetch-dealer-details",
    options: {
      description: "Fetch dealer details.",
      tags,
      validate: {
        headers: headerValidator,
      },
      handler: user_controllers.fetchDealerDetails,
    },
  },
  {
    method: "GET",
    path: "/fetch-customer-details",
    options: {
      description: "Fetch customer.",
      tags,
      validate: {
        headers: headerValidator,
      },
      handler: user_controllers.fetchCustomerDetails,
    },
  },
  {
    method: "GET",
    path: "/fetch-customer-enquiries",
    options: {
      description: "Fetch customer enquiry list.",
      tags,
      validate: {
        headers: headerValidator,
      },
      handler: customers_enquiry_controller.fetchCustomerEnquiries,
    },
  },
  {
    method: "POST",
    path: "/create-customer-enquiry",
    options: {
      description: "Add customer enquiry section.",
      tags,
      validate: {
        payload: customersEnquiryPayload.customers_enquiry_payload,
      },
      handler: customers_enquiry_controller.createCustomerEnquiry,
    },
  },
];

module.exports = user_routes;
