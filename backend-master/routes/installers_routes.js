const tags = ["api", "Installers"];

const { product_attributes_controlllers, installers_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator
} = require("../validators");

const installers_routes = [
    {
        method: "GET",
        path: "/fetch-all-installers",
        options: {
            description: "Fetch all Installers for admin.",
            validate: {
                headers: headerValidator,
                query: InstallersValidator.fetch_all_installers_admin_validator
            },
            tags,
            handler: installers_controllers.getAllInstallers,
        },
    },
    {
        method: "POST",
        path: "/add-installers",
        options: {
            description: "Add New Installers for admins.",
            validate: {
                headers: headerValidator,
                payload: InstallersValidator.add_installers_payload
            },
            tags,
            handler: installers_controllers.addInstaller,
        },
    },
    {
        method: "POST",
        path: "/edit-installer",
        options: {
            description: "Edit Installer for admin.",
            validate: {
                headers: headerValidator,
                payload: InstallersValidator.updateInstallersValidator
            },
            tags,
            handler: installers_controllers.editInstaller,
        },
    },
    {
        method: "POST",
        path: "/delete-installer",
        options: {
            description: "Delete Installer for admin.",
            validate: {
                headers: headerValidator,
                query: InstallersValidator.deleteInstallerValidator
            },
            tags,
            handler: installers_controllers.deleteInstaller,
        },
    },
    {
        method: "POST",
        path: "/update-installer-status",
        options: {
            description: "Status change Installers admin.",
            validate: {
                headers: headerValidator,
                query: InstallersValidator.statusChangeInstallerValidator
            },
            tags,
            handler: installers_controllers.toggleInstallerStatus,
        },
    },
]

module.exports = installers_routes;