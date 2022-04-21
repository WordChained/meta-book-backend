module.exports = {
    getSecret,
}
console.log(process.env);

async function getSecret() {
    return {
        cloudinaryAPIKey: process.env.cloudinaryAPIKey,
        cloudinaryAPISecret: process.env.cloudinaryAPISecret,
        CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
        googleMapApiKey: process.env.googleMapApiKey,
        UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
        googleMapApiKey: process.env.googleMapApiKey
    }
}