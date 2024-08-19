//api/register 
const registerRequest = {
        "username": "patient_test",
        "password": "password1234!"
};

const registerResponse = [
    {
        "message": "User registered successfully",
        "userID": 3
    }
]

//api/patients
const addPatientsRequest = {
    FirstName: 'Alice',
    LastName: 'Johnson',
    Gender: 'Female',
    BirthDate: '1992-05-16',
    ContactInfo: '+63901234567',
    Address: '789 Pine St, Cebu City, Philippines',
    UserID: 3
};

const addPatientsResponse = {
    "message": "Patient added successfully",
    "patientID": "P0004"
};

//api/patients/profile
const fetchProfileRequest = {
    method: 'GET',
    url: '/api/patients/profile',
    headers: {
      'Authorization': 'Bearer <JWT_Token>'
    }
};

const fetchProfileResponse = {
    FirstName: 'Alice',
    LastName: 'Johnson',
    Gender: 'Female',
    BirthDate: '1992-05-16',
    ContactInfo: '+63901234567',
    Address: '789 Pine St, Cebu City, Philippines',
    Status: true,
    UserID: 3
};

const fetchDoctorsInfoRequest = {
    method: 'GET',
    url: 'api/doctors/:specializationID', //ex. /api/doctors/SP001
    headers: {
      'Authorization': 'Bearer <JWT_Token>'
    }
}

const fetchDoctorsInfoResponse = [
        {
            "DoctorID": "DR0001",
            "FirstName": "John",
            "LastName": "Doe",
            "Gender": "M",
            "SpecializationID": "SP001",
            "ContactInfo": "john.doe@example.com",
            "IsAvailableToday": true
        },
        {
            "DoctorID": "DR0011",
            "FirstName": "Sophia",
            "LastName": "Thomas",
            "Gender": "F",
            "SpecializationID": "SP001",
            "ContactInfo": "sophia.thomas@example.com",
            "IsAvailableToday": true
        }
]

const specializations = [
    {
        "SpecializationID": "SP001",
        "Specialization": "Cardiology"
    },
    {
        "SpecializationID": "SP002",
        "Specialization": "Allergy and Immunology"
    },
    {
        "SpecializationID": "SP003",
        "Specialization": "Anesthesiology"
    },
    {
        "SpecializationID": "SP004",
        "Specialization": "Dermatology"
    },
    {
        "SpecializationID": "SP005",
        "Specialization": "Endocrinology"
    },
    {
        "SpecializationID": "SP006",
        "Specialization": "Gastroenterology"
    },
    {
        "SpecializationID": "SP007",
        "Specialization": "Geriatrics"
    },
    {
        "SpecializationID": "SP008",
        "Specialization": "Hematology"
    },
    {
        "SpecializationID": "SP009",
        "Specialization": "Infectious Disease"
    },
    {
        "SpecializationID": "SP010",
        "Specialization": "Internal Medicine"
    },
    {
        "SpecializationID": "SP011",
        "Specialization": "Nephrology"
    },
    {
        "SpecializationID": "SP012",
        "Specialization": "Neurology"
    },
    {
        "SpecializationID": "SP013",
        "Specialization": "Obstetrics and Gynecology (OB/GYN)"
    },
    {
        "SpecializationID": "SP014",
        "Specialization": "Oncology"
    },
    {
        "SpecializationID": "SP015",
        "Specialization": "Ophthalmology"
    },
    {
        "SpecializationID": "SP016",
        "Specialization": "Orthopedics"
    },
    {
        "SpecializationID": "SP017",
        "Specialization": "Otolaryngology (ENT)"
    },
    {
        "SpecializationID": "SP018",
        "Specialization": "Pediatrics"
    },
    {
        "SpecializationID": "SP019",
        "Specialization": "Physical Medicine and Rehabilitation"
    },
    {
        "SpecializationID": "SP020",
        "Specialization": "Plastic Surgery"
    },
    {
        "SpecializationID": "SP021",
        "Specialization": "Podiatry"
    },
    {
        "SpecializationID": "SP022",
        "Specialization": "Psychiatry"
    },
    {
        "SpecializationID": "SP023",
        "Specialization": "Radiology"
    },
    {
        "SpecializationID": "SP024",
        "Specialization": "Rheumatology"
    },
    {
        "SpecializationID": "SP025",
        "Specialization": "Surgery"
    },
    {
        "SpecializationID": "SP026",
        "Specialization": "Thoracic Surgery"
    },
    {
        "SpecializationID": "SP027",
        "Specialization": "Urology"
    },
    {
        "SpecializationID": "SP028",
        "Specialization": "Vascular Surgery"
    },
    {
        "SpecializationID": "SP029",
        "Specialization": "Emergency Medicine"
    },
    {
        "SpecializationID": "SP030",
        "Specialization": "Family Medicine"
    },
    {
        "SpecializationID": "SP031",
        "Specialization": "Pathology"
    },
    {
        "SpecializationID": "SP032",
        "Specialization": "Sports Medicine"
    },
    {
        "SpecializationID": "SP033",
        "Specialization": "Critical Care Medicine"
    },
    {
        "SpecializationID": "SP034",
        "Specialization": "Neonatology"
    },
    {
        "SpecializationID": "SP035",
        "Specialization": "Dermatopathology"
    },
    {
        "SpecializationID": "SP036",
        "Specialization": "Nuclear Medicine"
    },
    {
        "SpecializationID": "SP037",
        "Specialization": "Pain Medicine"
    },
    {
        "SpecializationID": "SP038",
        "Specialization": "Occupational Medicine"
    },
    {
        "SpecializationID": "SP039",
        "Specialization": "Sleep Medicine"
    }
]

let patientProfile = [
    {
        "ID": 1,
        "PatientID": "P0001",
        "FirstName": "Erika Jean",
        "LastName": "Acibar",
        "Gender": "Female",
        "BirthDate": "1994-07-14T00:00:00.000Z",
        "ContactInfo": "+63912345678",
        "Address": "123 Main St. Tacloban City, Leyte, Philippines 6500",
        "Status": true,
        "UserID": 1
    }

]

module.exports = {
    registerRequest,
    registerResponse,
    addPatientsRequest,
    addPatientsResponse,
    fetchProfileRequest,
    fetchProfileResponse,
    specializations,
};