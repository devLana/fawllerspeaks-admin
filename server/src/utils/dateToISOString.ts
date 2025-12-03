const dateToISOString = (dateString: string) => {
  return new Date(dateString).toISOString();
};

export default dateToISOString;
