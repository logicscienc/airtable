import { useState, useEffect } from "react";
import {
  getAirtableBases,
  getAirtableTables,
  createForm,
} from "../api"; // <-- using API helper

export default function CreateForm({ onFormCreated }) {
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedBase, setSelectedBase] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  // ---------------------------
  // 1. Fetch all Airtable Bases
  // ---------------------------
  useEffect(() => {
    const loadBases = async () => {
      try {
        const res = await getAirtableBases(); // uses axios instance (auto token)
        setBases(res.data || []);
      } catch (err) {
        console.error("Error fetching bases:", err);
      }
    };
    loadBases();
  }, []);

  // ------------------------------------
  // 2. Fetch Tables when Base is chosen
  // ------------------------------------
  useEffect(() => {
    if (!selectedBase) return;

    const loadTables = async () => {
      try {
        const res = await getAirtableTables(selectedBase);
        setTables(res.data || []);
      } catch (err) {
        console.error("Error fetching tables:", err);
      }
    };
    loadTables();
  }, [selectedBase]);

  // --------------------------------------------------
  // 3. Auto-generate Questions when Table is selected
  // --------------------------------------------------
 // --------------------------------------------------
// 3. Auto-generate Questions when Table is selected
// --------------------------------------------------
useEffect(() => {
  if (!selectedTable) return;

  const table = tables.find((t) => t.id === selectedTable);

  if (!table || !Array.isArray(table.fields)) {
    setQuestions([]);
    return;
  }

  // Map Airtable field types to allowed Mongoose types
  const mapAirtableTypeToFormType = (airtableType) => {
    switch (airtableType) {
      case "singleLineText":
      case "email":
      case "phoneNumber":
        return "singleLineText";
      case "multilineText":
        return "longText";
      case "singleSelect":
        return "singleSelect";
      case "multipleSelects":
        return "multipleSelects";
      case "attachment":
        return "attachment";
      default:
        return "singleLineText"; // fallback for unknown types
    }
  };

  const mappedQuestions = table.fields.map((field, idx) => ({
    questionKey: `q${idx + 1}`,
    airtableFieldId: field.id,
    label: field.name,
    type: mapAirtableTypeToFormType(field.type),
    required: false,
    conditionalRules: { logic: "AND", conditions: [] },
  }));

  setQuestions(mappedQuestions);
}, [selectedTable, tables]);


  // Update individual question
  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  // -----------------------------------
  // 4. Submit Form -> Save in your DB
  // -----------------------------------
  const handleSubmit = async () => {
    try {
      const formData = {
        airtableBaseId: selectedBase,
        airtableTableId: selectedTable,
        questions,
      };

      const res = await createForm(formData);

      alert("Form created successfully!");
      onFormCreated?.(res.data);

      // Reset all
      setSelectedBase("");
      setSelectedTable("");
      setQuestions([]);
      setTables([]);
    } catch (err) {
      console.error("Form creation error:", err);
      alert("Error creating form");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#FA1239] mb-4">Create New Form</h2>

      {/* Select Base */}
      <div className="mb-4">
        <label className="block mb-1">Airtable Base:</label>
        <select
          value={selectedBase}
          onChange={(e) => {
            setSelectedBase(e.target.value);
            setSelectedTable("");
            setQuestions([]);
            setTables([]);
          }}
          className="border p-2 w-full"
        >
          <option value="">Select a Base</option>
          {bases.map((base) => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Table */}
      {tables.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1">Airtable Table:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select a Table</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Auto-loaded Questions */}
      {questions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-[#FA1239] mb-2">
            Questions
          </h3>

          {questions.map((q, idx) => (
            <div key={idx} className="border p-2 mb-3">
              <input
                className="border p-2 w-full mb-2"
                value={q.label}
                onChange={(e) =>
                  handleQuestionChange(idx, "label", e.target.value)
                }
              />

              <select
                className="border p-2 w-full mb-2"
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(idx, "type", e.target.value)
                }
              >
                <option value="singleLineText">Single Line Text</option>
                <option value="longText">Long Text</option>
                <option value="singleSelect">Single Select</option>
                <option value="multipleSelects">Multiple Selects</option>
                <option value="attachment">Attachment</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    handleQuestionChange(idx, "required", e.target.checked)
                  }
                />
                Required
              </label>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-[#FA1239] text-white rounded mt-4"
      >
        Create Form
      </button>
    </div>
  );
}





