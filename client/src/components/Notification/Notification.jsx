const Notification = (api, axiosResponse) => {
  let status = axiosResponse.status >= 200 && axiosResponse.status < 300;
  const config = {
    message: (status) ? 'Exito': 'Error',
    description: (status) ? axiosResponse.data.message : axiosResponse.response.data.error,
    showProgress: true,
    pauseOnHover: false,
    placement: "topRight",
  };
  (status) ? api.success(config) : api.error(config);
};

export default Notification;
