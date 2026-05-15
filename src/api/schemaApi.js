// src/api/schemaApi.js
// All API calls live here.
// NOTE: attribute `type` now comes FROM the API — it is display-only in the UI.
// The consumer does not pick the type — the schema defines it.

const MOCK_SCHEMA = {
  module: {
    id: 'mod_001',
    name: 'InsuranceClaim',
    description: 'Insurance claim processing module',
  },
  classes: [
    {
      id: 'cls_001',
      name: 'Claimant',
      description: 'Person filing the claim',
      repeatable: true,
      attributes: [
        { id: 'a001', name: 'fullName',    type: 'string', value: '', required: true,  repeatable: false },
        { id: 'a002', name: 'dateOfBirth', type: 'date',   value: '', required: true,  repeatable: false },
        { id: 'a003', name: 'phoneNumber', type: 'string', value: '', required: false, repeatable: true  },
      ],
      classes: [
        {
          id: 'cls_002',
          name: 'Address',
          description: 'Claimant address details',
          repeatable: true,
          attributes: [
            { id: 'a004', name: 'street',  type: 'string', value: '', required: true,  repeatable: false },
            { id: 'a005', name: 'city',    type: 'string', value: '', required: true,  repeatable: false },
            { id: 'a006', name: 'zipCode', type: 'string', value: '', required: false, repeatable: false },
          ],
          classes: [],
        },
      ],
    },
    {
      id: 'cls_003',
      name: 'ClaimDetails',
      description: 'Details of the claim',
      repeatable: false,
      attributes: [
        { id: 'a007', name: 'claimNumber', type: 'string', value: '', required: true,  repeatable: false },
        { id: 'a008', name: 'claimAmount', type: 'number', value: '', required: true,  repeatable: false },
        { id: 'a009', name: 'description', type: 'string', value: '', required: false, repeatable: false },
      ],
      classes: [
        {
          id: 'cls_004',
          name: 'SupportingDocument',
          description: 'Attached supporting documents',
          repeatable: true,
          attributes: [
            { id: 'a010', name: 'documentName', type: 'string', value: '', required: true,  repeatable: false },
            { id: 'a011', name: 'documentType', type: 'string', value: '', required: true,  repeatable: false },
            { id: 'a012', name: 'tag',           type: 'string', value: '', required: false, repeatable: true  },
          ],
          classes: [],
        },
      ],
    },
  ],
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function fetchSchema() {
  await delay(800)
  return JSON.parse(JSON.stringify(MOCK_SCHEMA))
  // Real API:
  // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema`)
  // if (!res.ok) throw new Error('Failed to load schema')
  // return res.json()
}

export async function saveSchema(payload) {
  await delay(700)
  if (Math.random() > 0.05) {
    return { ok: true, savedAt: new Date().toISOString() }
  }
  throw new Error('Network error – please retry')
  // Real API:
  // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  // if (!res.ok) throw new Error('Save failed')
  // return res.json()
}