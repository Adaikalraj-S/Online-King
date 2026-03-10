const tags = ["api", "Stories"];

const { product_attributes_controlllers, installers_controllers, stories_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator,
    StoriesValidator
} = require("../validators");

const stories_routes = [
    {
        method: "GET",
        path: "/fetch-all-stories",
        options: {
            description: "Fetch all Stories for admin.",
            validate: {
                headers: headerValidator,
                // query: StoriesValidator.add_installers_payload
            },
            tags,
            handler: stories_controllers.getStories,
        },
    },
    {
        method: "GET",
        path: "/fetch-all-stories-customer",
        options: {
            description: "Fetch all Stories for Customers.",
            validate: {
                // headers: headerValidator,
                query: StoriesValidator.fetch_all_stories_validators
            },
            tags,
            handler: stories_controllers.getStoriesCustomer,
        },
    },
    {
        method: "POST",
        path: "/add-photo-stories",
        options: {
            description: "Add New Photo Stories for Customers.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: StoriesValidator.add_stories_payload
            },
            tags,
            handler: stories_controllers.addPhotoStories,
        },
    },
    {
        method: "POST",
        path: "/add-video-stories",
        options: {
            description: "Add New Video Stories for Customers.",
            payload: {
                maxBytes: 100 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: StoriesValidator.add_video_stories_payload
            },
            tags,
            handler: stories_controllers.addVideoStories,
        },
    },
    {
        method: "POST",
        path: "/edit-story",
        options: {
            description: "Edit Story for admin.",
            payload: {
                maxBytes: 100 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: StoriesValidator.editStoriesPayload
            },
            tags,
            handler: stories_controllers.editStories,
        },
    },
    {
        method: "POST",
        path: "/approve-story",
        options: {
            description: "Approve Story for admin.",
            validate: {
                headers: headerValidator,
                query: StoriesValidator.approve_story_validator
            },
            tags,
            handler: stories_controllers.approveStory,
        },
    },
    {
        method: "POST",
        path: "/reject-story",
        options: {
            description: "Reject Story for admin.",
            validate: {
                headers: headerValidator,
                payload: StoriesValidator.reject_story_validator
            },
            tags,
            handler: stories_controllers.rejectStory,
        },
    },
    {
        method: "POST",
        path: "/delete-story",
        options: {
            description: "Delete Story for admin.",
            validate: {
                headers: headerValidator,
                query: StoriesValidator.delete_story_validator
            },
            tags,
            handler: stories_controllers.deleteStory,
        },
    },
    {
        method: "POST",
        path: "/update-story-status",
        options: {
            description: "Status change Installers admin.",
            validate: {
                headers: headerValidator,
                query: StoriesValidator.statusChangeStoryValidator
            },
            tags,
            handler: stories_controllers.toggleStoryStatus,
        },
    },
]

module.exports = stories_routes;