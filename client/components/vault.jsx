import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchVault from "../Store/token";
import postVault from "../Store/postVault";
import editVault from "../Store/editVault";
import deleteVault from "../Store/deleteVault";
import toast from "react-hot-toast";
import { clearAuth } from "../Store/authSlice";

const Vault = () => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.password.items);

  const name = useSelector((state) => state.auth.user.username);

  


const handleLogout = async () => {

  const res = await fetch("http://localhost:5005/logout", {
    method: "POST",
    credentials: "include"
  })

  if(res.ok){

    dispatch(clearAuth())
  }
}

  const [formData, setFormData] = useState({
    site_name: "",
    encrypted_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [edit, setEdit] = useState({
    id: "",
    site_name: "",
    encrypted_password: "",
  });

  const [editB, setEditB] = useState(false);

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleItem = (item) => {
    const id = item.id;
    const site = item.site_name;
    const password = item.encrypted_password;

    setEdit(() => ({
      id: id,
      site_name: site,
      encrypted_password: password,
    }));
  };

  const handleDelete = (e) => {
    dispatch(deleteVault(e));
    dispatch(fetchVault());
    toast.success("Deleted successfully")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.site_name && !formData.password) {
      toast.error("Credentials required");
    }

    try {
      const result = await dispatch(postVault(formData)).unwrap();

      toast.success("Credentials added Successfully!");

      setFormData({
        site_name: "",
        encrypted_password: "",
      });
      dispatch(fetchVault());
    } catch (error) {
      toast.error(error.message || error);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    if (!edit.site_name && !edit.encrypted_password) {
      return toast.error("Edit fields to submit");
    }

    try {
      const result = await dispatch(editVault(edit)).unwrap();

      toast.success("Changes Saved");
      setEditB(false);
      dispatch(fetchVault());
    } catch (error) {
      toast.error(error.message || error);
    }
  };

    useEffect(() => {
    dispatch(fetchVault());

    console.log(fetchVault.items)
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Header */}
          <div className="relative rounded-lg bg-white p-6 shadow">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Vault</h1>

    <h3 className="mt-2 text-lg text-gray-600">
      Welcome {name ? name : "Amithabh Bachpan"}
    </h3>
  </div>

  <button
    type="button"
    onClick={handleLogout}
    className="absolute right-6 top-6 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
  >
    Logout
  </button>
</div>

          {/* Vault List */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-6 border-b pb-3 text-2xl font-semibold text-gray-800">
              Saved Credentials
            </h2>

            <div className="space-y-4">
              {items?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Site Name
                      </h4>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {item.site_name}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Password
                      </h4>
                      <p className="mt-1 break-all text-lg font-medium text-gray-900">
                        {item.encrypted_password}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                      onClick={() => {
                        (setEditB(true), handleItem(item));
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit / Add Form */}
          {editB ? (
            <div key={edit.id} className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-6 border-b pb-3 text-2xl font-semibold text-gray-800">
                Edit Credential
              </h3>

              <form onSubmit={handleSubmit2} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Site Name
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="site_name"
                    onChange={handleEdit}
                    value={edit.site_name}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="encrypted_password"
                    onChange={handleEdit}
                    value={edit.encrypted_password}
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
                >
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-6 border-b pb-3 text-2xl font-semibold text-gray-800">
                Add New Entry
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Site Name
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="site_name"
                    onChange={handleChange}
                    placeholder="Site Name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="encrypted_password"
                    onChange={handleChange}
                    placeholder="Site Password"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
                >
                  Add Credential
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Vault;
