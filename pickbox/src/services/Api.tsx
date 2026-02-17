import { backendRoute } from "./httpClient";

const Api = {
    signout: async function () {
        try {
            const response = await backendRoute.post('/auth/signout', {}, { withCredentials: true })

            return response
        } catch(e) {
            throw e
        }
    },
    signin: async function (data: any) {
      try {
        const response = await backendRoute.post('/auth/signin', data)
        return response
      } catch(e) {
        throw e
      }
    },
    signup: async function (data: any) {
      try {
        const response = await backendRoute.post('/auth/signup', data)
        return response
      } catch(e) {
        throw e
      }
    },
    getMe: async function () {
      try{
        const response = await backendRoute.get('/user/me', { withCredentials: true });
        return response;
      }catch(e){
        throw e;
      }  
    },
    uploadFiles: async function (files: File[]) {
      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });

        const response = await backendRoute.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        return response;
      } catch(e) {
        throw e;
      }
    },
    getFiles: async function () {
      try {
        const response = await backendRoute.get('/files', { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    deleteFile: async function (fileId: string) {
      try {
        const response = await backendRoute.delete(`/files/${fileId}`, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    shareFile: async function (fileId: string, sharedWithUserId: string, role: string) {
      try {
        const response = await backendRoute.post(`/files/${fileId}/share`, {
          sharedWithUserId,
          role,
        }, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    unshareFile: async function (fileId: string, userId: string) {
      try {
        const response = await backendRoute.delete(`/files/${fileId}/share/${userId}`, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    getFileShares: async function (fileId: string) {
      try {
        const response = await backendRoute.get(`/files/${fileId}/shares`, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    getSharedWithMe: async function () {
      try {
        const response = await backendRoute.get('/files/shared/with-me', { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    getUserByEmail: async function (email: string) {
      try {
        const response = await backendRoute.get(`/user/by-email/${email}`, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    updateFile: async function (fileId: string, originalName: string) {
      try {
        const response = await backendRoute.patch(`/files/${fileId}`, {
          originalName,
        }, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    createFileLink: async function (fileId: string, expiresAt?: string) {
      try {
        const response = await backendRoute.post(`/files/${fileId}/links`, {
          expiresAt,
        }, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    getFileLinks: async function (fileId: string) {
      try {
        const response = await backendRoute.get(`/files/${fileId}/links`, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    deleteFileLink: async function (linkId: string) {
      try {
        const response = await backendRoute.delete(`/files/links/${linkId}`, { withCredentials: true });
        return response;
      } catch(e) {
        throw e;
      }
    },
    getFileInfoByLink: async function (token: string) {
      try {
        const response = await backendRoute.get(`/files/public/info/${token}`);
        return response;
      } catch(e) {
        throw e;
      }
    },
    downloadFile: async function (fileId: string) {
      try {
        const response = await backendRoute.get(`/files/download/${fileId}`, {
          responseType: 'blob',
          withCredentials: true,
        });
        return response;
      } catch(e) {
        throw e;
      }
    },
    downloadFileByLink: async function (token: string) {
      try {
        const response = await backendRoute.get(`/files/public/download/${token}`, {
          responseType: 'blob',
        });
        return response;
      } catch(e) {
        throw e;
      }
    },
}

export default Api