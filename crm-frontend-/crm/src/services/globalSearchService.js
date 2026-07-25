import api from "./api";

export const fetchGlobalSearch = (search) => {
  // return api.get(`/global-search/?search=${search}`);
  return api.get(`/global-search/?search=${encodeURIComponent(search)}`);
};

