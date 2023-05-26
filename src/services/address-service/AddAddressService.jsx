import axios from "axios";

export const AddAddressService = async (newAddress, encodedToken) =>
  await axios.post(
    "/api/user/address/add",
    { address: newAddress },
    {
      headers: { authorization: encodedToken },
    }
  );
