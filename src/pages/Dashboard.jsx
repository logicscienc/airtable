import { useState, useEffect } from "react";
import { getMyForms } from "../api"; // your API helper
import { useNavigate } from "react-router-dom";
import CreateForm from "./CreateForm";
import FormDetails from "./FormDetails";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home"); // "home", "createForm", "formDetails"
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchForms = async () => {
    try {
      const res = await getMyForms();
      console.log(res.data); // inspect what you got
      // if backend returns { forms: [...] }
      setForms(Array.isArray(res.data) ? res.data : res.data.forms || []);
    } catch (err) {
      console.error(err);
    }
  };
  fetchForms();
}, []);

  // Sidebar links
  const tabs = [
    { key: "home", label: "Dashboard Home" },
    { key: "createForm", label: "Create Form" },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#FA1239] text-white flex flex-col">
        <h2 className="text-2xl font-bold p-6 border-b border-white">AirForms</h2>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedFormId(null); // reset selected form
              }}
              className={`block w-full text-left px-4 py-2 rounded-md hover:bg-white hover:text-[#FA1239] transition ${
                activeTab === tab.key ? "bg-white text-[#FA1239]" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="mt-6 block w-full text-left px-4 py-2 rounded-md hover:bg-white hover:text-[#FA1239] transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Home / Forms List */}
        {activeTab === "home" && (
          <div>
            <h1 className="text-3xl font-bold text-[#FA1239] mb-6">Your Forms</h1>

            {forms.length === 0 ? (
              <p>No forms yet. Click "Create Form" to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                  <div
                    key={form._id}
                    className="border border-[#FA1239] rounded-lg p-4 flex flex-col justify-between"
                  >
                    <h2 className="text-xl font-semibold text-[#FA1239]">{form.title || "Untitled Form"}</h2>
                    <p>Questions: {form.questions?.length || 0}</p>
                    <p>Airtable Base: {form.airtableBaseId}</p>
                    <p>Airtable Table: {form.airtableTableId}</p>
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80 transition"
                        onClick={() => {
                          setSelectedFormId(form._id);
                          setActiveTab("formDetails");
                        }}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80 transition"
                        onClick={() => setActiveTab("createForm")}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Form */}
        {activeTab === "createForm" && (
          <CreateForm
            onFormCreated={(newForm) => setForms([...forms, newForm])}
          />
        )}

        {/* Form Details */}
        {activeTab === "formDetails" && selectedFormId && (
          <FormDetails formId={selectedFormId} />
        )}
      </div>
    </div>
  );
}


