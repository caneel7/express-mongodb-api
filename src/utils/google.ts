import { Auth, people_v1 } from 'googleapis';

const oauthClient = new Auth.OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URL
})

const generateAuthLink = async():Promise<string>=>{
    try {

        //returns authurl with scopes for user's profile and email address info
        return oauthClient.generateAuthUrl({
            access_type: 'online',
            scope:['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
        })
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getGoogleProfileData = async(token:string)=>{
    try {

        const  { tokens }  = await oauthClient.getToken(token);
        oauthClient.setCredentials(tokens);

        const profile = new people_v1.People({
            auth: oauthClient
        });

        const { data } = await profile.people.get({
            resourceName:'people/me',
            personFields:'names,emailAddresses'
        });

        return data;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {
    generateAuthLink,
    getGoogleProfileData
}