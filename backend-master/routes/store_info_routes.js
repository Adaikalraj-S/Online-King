const tags = ["api", "Store Info"];

const { product_attributes_controlllers, installers_controllers, stories_controllers, store_info_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator,
    StoriesValidator,
    StoreInfoValidator
} = require("../validators");

const store_info_routes = [
    {
        method: "GET",
        path: "/fetch-all-store-info",
        options: {
            description: "Fetch all Store Info for admin.",
            validate: {
                headers: headerValidator,
                // query: StoriesValidator.add_installers_payload
            },
            tags,
            handler: store_info_controllers.getAllStoreInfo,
        },
    },
    {
        method: "POST",
        path: "/add-store-info-admin",
        options: {
            description: "Add Store Info for Admins.",
            validate: {
                headers: headerValidator,
                payload: StoreInfoValidator.add_store_info_payload
            },
            tags,
            handler: store_info_controllers.addOrUpdateStoreInfo,
        },
    },
    {
        method: "POST",
        path: "/toggle-status-store-info-admin",
        options: {
            description: "Toggle store information status for Admins.",
            validate: {
                headers: headerValidator,
                query: StoreInfoValidator.update_status_store_info
            },
            tags,
            handler: store_info_controllers.toggleStoreData,
        },
    },
    // {
    //     method: "POST",
    //     path: "/add-photo-stories",
    //     options: {
    //         description: "Add New Photo Stories for Customers.",
    //         payload: {
    //             maxBytes: 20 * 1024 * 1024,
    //             output: 'file',
    //             parse: true,
    //             multipart: true     // <-- this fixed the media type error
    //         },
    //         validate: {
    //             headers: headerValidator,
    //             payload: StoriesValidator.add_stories_payload
    //         },
    //         tags,
    //         handler: stories_controllers.addPhotoStories,
    //     },
    // },
    // {
    //     method: "POST",
    //     path: "/add-video-stories",
    //     options: {
    //         description: "Add New Video Stories for Customers.",
    //         payload: {
    //             maxBytes: 100 * 1024 * 1024,
    //             output: 'file',
    //             parse: true,
    //             multipart: true     // <-- this fixed the media type error
    //         },
    //         validate: {
    //             headers: headerValidator,
    //             payload: StoriesValidator.add_video_stories_payload
    //         },
    //         tags,
    //         handler: stories_controllers.addVideoStories,
    //     },
    // },
    // // {
    // //     method: "POST",
    // //     path: "/edit-installer",
    // //     options: {
    // //         description: "Edit Installer for admin.",
    // //         validate: {
    // //             headers: headerValidator,
    // //             payload: InstallersValidator.updateInstallersValidator
    // //         },
    // //         tags,
    // //         handler: installers_controllers.editInstaller,
    // //     },
    // // },
    // {
    //     method: "POST",
    //     path: "/approve-story",
    //     options: {
    //         description: "Approve Story for admin.",
    //         validate: {
    //             headers: headerValidator,
    //             query: StoriesValidator.approve_story_validator
    //         },
    //         tags,
    //         handler: stories_controllers.approveStory,
    //     },
    // },
    // {
    //     method: "POST",
    //     path: "/reject-story",
    //     options: {
    //         description: "Reject Story for admin.",
    //         validate: {
    //             headers: headerValidator,
    //             payload: StoriesValidator.reject_story_validator
    //         },
    //         tags,
    //         handler: stories_controllers.rejectStory,
    //     },
    // },
    // {
    //     method: "POST",
    //     path: "/delete-story",
    //     options: {
    //         description: "Delete Story for admin.",
    //         validate: {
    //             headers: headerValidator,
    //             query: StoriesValidator.delete_story_validator
    //         },
    //         tags,
    //         handler: stories_controllers.deleteStory,
    //     },
    // },
    // {
    //     method: "POST",
    //     path: "/update-story-status",
    //     options: {
    //         description: "Status change Installers admin.",
    //         validate: {
    //             headers: headerValidator,
    //             query: StoriesValidator.statusChangeStoryValidator
    //         },
    //         tags,
    //         handler: stories_controllers.toggleStoryStatus,
    //     },
    // },
]

module.exports = store_info_routes;