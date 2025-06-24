const useBinPost = () => {
  const binPost = (id: string) => {
    alert("Trying to send post with id of " + id + " to bin");
  };

  return binPost;
};

export default useBinPost;
