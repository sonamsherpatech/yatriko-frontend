"use client";
import { IInterfaceOrganizationType } from "@/app/(public)/create-organization/organization-types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { updateOrganization } from "../../../../lib/store/organization/organization-slice";
import { updateSchema } from "./edit-organzation-validation";

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get current organization from Redux store
  const { organization } = useAppSelector((state) => state.organization);
  const currentOrg = organization[0]; // Assuming first org is current
  console.log(currentOrg);

  const [editOrganization, setEditOrganization] =
    useState<IInterfaceOrganizationType>({
      organizationName: "",
      organizationEmail: "",
      organizationAddress: "",
      organizationPhoneNumber: "",
      organizationLogo: "",
    });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<File | string>("");
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Populate form with existing organization data
  useEffect(() => {
    if (currentOrg) {
      setEditOrganization({
        organizationName: currentOrg.organizationName || "",
        organizationEmail: currentOrg.organizationEmail || "",
        organizationAddress: currentOrg.organizationAddress || "",
        organizationPhoneNumber: currentOrg.organizationPhoneNumber || "",
        organizationLogo: currentOrg.organizationLogo || "",
      });
      if (currentOrg.organizationLogo) {
        setLogoPreview(currentOrg.organizationLogo);
      }
    }
  }, [currentOrg]);

  function handleEditDataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditOrganization({
      ...editOrganization,
      [name]: value,
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleEditDataSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const result = updateSchema.safeParse(editOrganization);
    if (!result.success) {
      setErrors(result.error.format());
      return;
    }
    
    if (!currentOrg?.id) {
      alert("Organization ID not found");
      return;
    }

    setErrors({});

    // Prepare data for update
    const updateData = {
      ...editOrganization,
      organizationLogo: logoFile || editOrganization.organizationLogo,
    };

    dispatch(updateOrganization(currentOrg.id, updateData));
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <button
        onClick={() => router.push(`/dashboard/organization/profile`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 ml-4 mb-6 cursor-pointer"
      >
        <ArrowLeft size={20} /> Back to profile
      </button>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Organization
        </h1>

        <form onSubmit={handleEditDataSubmission} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={editOrganization.organizationName}
              onChange={handleEditDataChange}
              placeholder="Enter organization name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizationName._errors?.[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Address</label>
            <input
              type="text"
              name="organizationAddress"
              value={editOrganization.organizationAddress}
              onChange={handleEditDataChange}
              placeholder="Enter address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizationAddress._errors?.[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="organizationEmail"
              value={editOrganization.organizationEmail}
              onChange={handleEditDataChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizationEmail._errors?.[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="organizationPhoneNumber"
              value={editOrganization.organizationPhoneNumber}
              onChange={handleEditDataChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.organizationPhoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizationPhoneNumber._errors?.[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Logo</label>
            {logoPreview && (
              <div className="mb-2">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              name="organizationLogo"
              onChange={handleFileChange}
              className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Update Organization
          </button>
        </form>
      </div>
    </div>
  );
}
