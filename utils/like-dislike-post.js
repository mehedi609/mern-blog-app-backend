exports.hasChosen = (arr, loginUserId) =>
  arr?.some((userId) => userId.toString() === loginUserId.toString());
