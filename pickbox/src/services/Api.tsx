import { backendRoute } from "./httpClient";

const Api = {
    signout: async function () {
        try {
            const response = await backendRoute.post('/auth/signout', {}, { withCredentials: true })

            return response
        } catch(e) {
            console.log(e)
        }
    },
    signin: async function (data: any) {
      try {
        const response = await backendRoute.post('/auth/signin', data)
        return response
      } catch(e) {
        console.log(e)
        throw e
      }
    },
    signup: async function (data: any) {
      try {
        const response = await backendRoute.post('/auth/signup', data)
        return response
      } catch(e) {
        console.log(e)
        throw e
      }
    },
    getMe: async function () {
      try{
        console.log('Api.getMe - Making request to /user/me');
        const response = await backendRoute.get('/user/me', { withCredentials: true });
        console.warn('Api.getMe - Response:', response)
        return response;
      }catch(e){
        console.error('Api.getMe - Error:', e);
        throw e;
      }  
    },
}

export default Api