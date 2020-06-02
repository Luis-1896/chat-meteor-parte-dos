import {Meteor} from "meteor/meteor";
import fs from "fs-extra";

if (Meteor.isDevelopment) {
    if (Meteor.settings.private && Meteor.settings.private.STORAGE_PATH) {
        process.env.STORAGE_PATH = Meteor.settings.private.STORAGE_PATH;
    } else {
        console.warn('[Versus] - DEFAULT STORAGE CONFIGURATION IS ACTIVE. ');
    }
}

export default {
    path_upload_files: process.env.STORAGE_PATH,
    PATH_USER_FILE: "users/",
    getCommonExtensionOfFilename(filename) {
        let extIndex = filename.length - 3;
        return filename.substring(extIndex, filename.length);
    },
    getFilenameWithoutExtension(filename) {
        let filenameWithoutExtension = '';
        if (filename.includes(".") && filename.length > 0) {
            filenameWithoutExtension = filename.split(".")[0];
        } else {
            filenameWithoutExtension = filename;
        }
        return filenameWithoutExtension;
    },
    existsUserDirectory(dirname){
        return fs.existsSync(this.path_upload_files+'/'+this.PATH_USER_FILE+dirname);
    },
    async updateUserFoldername(oldFoldername, newFoldername) {
        let isSuccess = false;
        if (fs.existsSync(this.path_upload_files + '/' + this.PATH_USER_FILE + oldFoldername)) {
            isSuccess = await new Promise(resolve => {
                fs.rename(this.path_upload_files + '/' + this.PATH_USER_FILE + oldFoldername,
                    this.path_upload_files + '/' + this.PATH_USER_FILE + newFoldername, (error) => {
                        if (error) {
                            console.error(`Failed to rename folder: ${error}`);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
            });
        }
        return isSuccess;
    },
    async updateLogoAndThumbnailNamesOfUser(oldName, newName, pathUser) {
        let isSuccess = false;
        let isSuccessLogo = false;
        let isSuccessThumbnail = false;
        if (fs.existsSync(this.path_upload_files + '/' + pathUser + '/' + oldName) &&
            fs.existsSync(this.path_upload_files + '/' + pathUser + '/' + this.getFilenameWithoutExtension(oldName)
                + "_thumb." + this.getCommonExtensionOfFilename(oldName))) {
            isSuccessLogo = await new Promise(resolve => {
                fs.rename(this.path_upload_files + '/' + pathUser + '/' + oldName,
                    this.path_upload_files + '/' + pathUser + '/' + newName, (error) => {
                        if (error) {
                            console.error(`Failed to rename logo name: ${error}`);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
            });
            isSuccessThumbnail = await new Promise(resolve => {
                fs.rename(this.path_upload_files + '/' + pathUser + '/' + this.getFilenameWithoutExtension(oldName)
                    + "_thumb." + this.getCommonExtensionOfFilename(oldName),
                    this.path_upload_files + '/' + pathUser + '/' + this.getFilenameWithoutExtension(newName)
                    + "_thumb." + this.getCommonExtensionOfFilename(newName), (error) => {
                        if (error) {
                            console.error(`Failed to rename thumbnail name: ${error}`);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
            });
            isSuccess = isSuccessLogo && isSuccessThumbnail;
        }
        return isSuccess;
    }

}