const tags = ["api", "Testimonials Info"];

const { product_attributes_controlllers, installers_controllers, stories_controllers, store_info_controllers, testimonials_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator,
    StoriesValidator,
    StoreInfoValidator,
    TestimonialsValidator
} = require("../validators");

const testimonials_info_routes = [
    {
        method: "GET",
        path: "/fetch-all-testimonials",
        options: {
            description: "Fetch all Testimonials Info for admin.",
            validate: {
                headers: headerValidator,
                // query: StoriesValidator.add_installers_payload
            },
            tags,
            handler: testimonials_controllers.getAllTestimonials,
        },
    },
    {
        method: "GET",
        path: "/fetch-all-testimonials-customers",
        options: {
            description: "Fetch all Testimonials Info for Customers.",
            // validate: {
            //     headers: headerValidator,
            //     // query: StoriesValidator.add_installers_payload
            // },
            tags,
            handler: testimonials_controllers.getAllTestimonialsCustomers,
        },
    },
    {
        method: "POST",
        path: "/add-testimonial-admin",
        options: {
            description: "Add Testimonials for Admins.",
            validate: {
                headers: headerValidator,
                payload: TestimonialsValidator.add_testimonials_payload
            },
            tags,
            handler: testimonials_controllers.addTestimonial,
        },
    },
    {
        method: "POST",
        path: "/edit-testimonial-admin",
        options: {
            description: "Edit Testimonials for Admins.",
            validate: {
                headers: headerValidator,
                payload: TestimonialsValidator.edit_testimonials_payload
            },
            tags,
            handler: testimonials_controllers.editTestimonial,
        },
    },
    {
        method: "POST",
        path: "/delete-testimonial",
        options: {
            description: "Delete Testimonial for admin.",
            validate: {
                headers: headerValidator,
                query: TestimonialsValidator.deleteTestimonialsValidator
            },
            tags,
            handler: testimonials_controllers.deleteTestimonial,
        },
    },
    {
        method: "POST",
        path: "/update-testimonial-status",
        options: {
            description: "Status change Testimonials admin.",
            validate: {
                headers: headerValidator,
                query: TestimonialsValidator.statusChangeTestimonialsValidator
            },
            tags,
            handler: testimonials_controllers.toggleTestimonialStatus,
        },
    },
]

module.exports = testimonials_info_routes;