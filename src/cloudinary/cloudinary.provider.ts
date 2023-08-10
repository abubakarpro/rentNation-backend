import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dgbjpy7ev',
      api_key: '278248299317886',
      api_secret: 'SPNdGFXd24YKWqQF5aH6sWAS_ek',
    });
  },
};
