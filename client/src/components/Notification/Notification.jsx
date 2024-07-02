const Notification = (api, response, description) => {
  const config = {
    message: (response >= 200 && response < 300) ? 'Exito': 'Error',
    description: description,
    showProgress: true,
    placement: "topRight",
  };
  console.log(response);
  (response >= 200 && response < 300) ? api.success(config) : api.error(config);
};

export default Notification;
