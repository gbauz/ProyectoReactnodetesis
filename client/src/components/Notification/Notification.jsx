const Notification = (api, response, message, description) => {
  const config = {
    message: message,
    description: description,
    showProgress: true,
    placement: "topRight",
  };
  console.log(response);
  (response === "Exito") ? api.success(config) : api.error(config);
};

export default Notification;
