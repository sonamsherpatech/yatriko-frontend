"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { schema } from "./create-organization-validation";
import { IInterfaceOrganizationType } from "./organization-types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createOrganization } from "@/lib/store/organization/organization-slice";
import { Status } from "@/lib/types";
import { showToast } from "@/lib/toastify/toastify";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

export default function CreateOrganization() {
  const dispatch = useAppDispatch();
  const { error, organization, status } = useAppSelector(
    (state) => state.organization
  );
  const [orgType, setOrgType] = useState<string>("");
  const [data, setData] = useState<IInterfaceOrganizationType>({
    organizationName: "",
    organizationEmail: "",
    organizationPhoneNumber: "",
    organizationAddress: "",
    organizationLogo: "",
    organizationPanNo: "",
    organizationVatNo: "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  //handling form data change
  function handleOrganizationDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setData({
        ...data,
        organizationLogo: file,
      });
    }
  }

  function handleOrgTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setOrgType(value);
    setData((prev) => ({
      ...prev,
      organizationPanNo:
        value === "organizationPanNo" ? prev.organizationPanNo : "",
      organizationVatNo:
        value === "organizationVatNo" ? prev.organizationVatNo : "",
    }));
  }

  useEffect(() => {
    if (status === Status.SUCCESS) {
      showToast({
        text: "Organization Created Sucessfully",
        style: {
          background: "#008000",
          color: "white",
        },
      });
    } else if (status === Status.ERROR) {
      showToast({
        text: error || "Failed to create Organization",
        style: {
          background: "#800000",
          color: "white",
        },
      });
    }
  }, [status, error]);

  function handleOrganizationDataSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
      dispatch(createOrganization(data));
    }
  }

  return (
    <div className="p-8 flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create Organization
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          <em>Build your presence on our tourism platform.</em>
        </p>

        <form onSubmit={handleOrganizationDataSubmission} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              onChange={handleOrganizationDataChange}
              placeholder="Enter organization name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationName && (
              <p style={errorStyle}>{errors.organizationName._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Address</label>
            <input
              type="text"
              name="organizationAddress"
              onChange={handleOrganizationDataChange}
              placeholder="Enter address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationAddress && (
              <p style={errorStyle}>{errors.organizationAddress._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="organizationEmail"
              onChange={handleOrganizationDataChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationEmail && (
              <p style={errorStyle}>{errors.organizationEmail._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="organizationPhoneNumber"
              onChange={handleOrganizationDataChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationPhoneNumber && (
              <p style={errorStyle}>
                {errors.organizationPhoneNumber._errors[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              name="organizationLogo"
              onChange={handleFileChange}
              className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            {errors.organizationLogo && (
              <p style={errorStyle}>{errors.organizationLogo._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Organization Registration Number
            </label>
            <select
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleOrgTypeChange}
            >
              <option value="">Select Type</option>
              <option value="organizationPanNo">PAN Number</option>
              <option value="organizationVatNo">VAT Number</option>
            </select>
          </div>

          {orgType && (
            <div
              className="transition-all duration-300"
              style={{ marginTop: "0.5rem" }}
            >
              <label className="block text-gray-700 text-sm mb-1">
                {orgType === "organizationPanNo" ? "PAN" : "VAT"} Number
              </label>
              <input
                type="text"
                name={orgType}
                value={data.organizationPanNo || data.organizationVatNo}
                onChange={handleOrganizationDataChange}
                placeholder={`Enter ${
                  orgType === "organizationPanNo" ? "PAN" : "VAT"
                } number`}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create Organization
          </button>
        </form>
      </div>
    </div>
  );
}
