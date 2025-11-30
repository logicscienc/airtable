import { useState, useEffect } from "react";
import { getMyForms } from "../api"; 
import { useNavigate } from "react-router-dom";
import CreateForm from "./CreateForm";
import { FiMenu, FiX } from "react-icons/fi";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home"); 
  const [forms, setForms] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await getMyForms();
        console.log("Forms loaded:", res.data);
        setForms(res.data?.data || []);
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
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col w-64 bg-[#FA1239] text-white">
        <h2 className="text-2xl font-bold p-6 border-b border-white">AirForms</h2>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
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

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 z-30 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="w-64 bg-[#FA1239] h-full text-white p-6 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">AirForms</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-white text-2xl">
              <FiX />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSidebarOpen(false);
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
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#FA1239] text-white">
          <h2 className="text-xl font-bold">AirForms</h2>
          <button onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-2xl" />
          </button>
        </div>

        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {/* Home / Forms List */}
          {activeTab === "home" && (
            <div>
              <h1 className="text-3xl font-bold text-[#FA1239] mb-6">Your Forms</h1>

              {forms.length === 0 ? (
                <p>No forms yet. Click "Create Form" to get started.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {forms.map((form) => (
                    <div
                      key={form._id}
                      className="border border-[#FA1239] rounded-lg p-4 flex flex-col justify-between"
                    >
                      <h2 className="text-xl font-semibold text-[#FA1239]">{form.title || "Untitled Form"}</h2>
                      <p>Questions: {form.questions?.length || 0}</p>
                      <p>Airtable Base: {form.airtableBaseId}</p>
                      <p>Airtable Table: {form.airtableTableId}</p>
                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <button
                          className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80 transition"
                          onClick={() => navigate(`/form/${form._id}`)}
                        >
                          View
                        </button>

                        <button
                          className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80 transition"
                          onClick={() => navigate(`/form/${form._id}/edit`)}
                        >
                          Edit
                        </button>

                        <button
                          className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80 transition"
                          onClick={() => navigate(`/form/${form._id}/responses`)}
                        >
                          Responses
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
        </div>
      </div>
    </div>
  );
}




