# Hexadigitall Textbook Ecosystem: Architecture & Flow Guide

This document outlines the architectural and behavioral differences between the **Textbooks** ecosystem and the **Imprints** ecosystem within the Hexadigitall store, specifically detailing the user journey based on the selected edition and the user's role.

---

## 1. Ecosystem Distinctions

| Feature | Digital Imprints | Educational Textbooks |
| :--- | :--- | :--- |
| **Versions** | Single version for all users. | Dual versions: **Student Edition** & **Teacher Edition**. |
| **Target Audience** | General public, professionals. | External learners/educators & Internal Hexadigitall Academy members. |
| **Acquisition Flow** | Simple, direct checkout (Buy Book). | Role-based branching (External vs. Internal Auth). |
| **Fulfillment** | PDF Download via email link. | Download (External) OR Webcopy/Account Dashboard (Internal). |

---

## 2. Role Definitions for Textbooks

When a user attempts to acquire a textbook, they must identify their role. The system categorizes these into four distinct paths:

### External Users (Unregistered / Public)
1. **Student** (Self-study, external)
2. **Teacher / Mentor / Parent** (Buying for an external student or personal teaching)
   - **Flow:** These users are presented with a specific **External Checkout Modal**.
   - **Required Details:** Full Name, Email Address, WhatsApp Number (Optional).
   - **Fulfillment:** Payment -> Download PDF -> Prompt to register copy.

### Internal Users (Hexadigitall Academy)
3. **Student (Hexadigitall)**
   - **Flow:** Prompted to sign in. Once authenticated, they proceed to checkout for the **Student Edition** linked directly to their academy account.
4. **Teacher / Mentor (Hexadigitall)**
   - **Flow (Teacher Edition):** Prompted to sign in. Once authenticated, they are granted immediate access to the **Instructor Webcopy** (no payment required for their teaching materials).
   - **Flow (Student Edition):** If they wish to purchase the Student Edition, they follow the internal authenticated checkout flow.

---

## 3. Structural UML (Class/Component Architecture)

The following diagram illustrates how the components and data structures relate to one another to fulfill this requirement.

```mermaid
classDiagram
    class StoreProduct {
        <<Interface>>
        +title: String
        +price: Number
    }

    class DigitalImprint {
        +type: "imprint"
        +buyDirectly()
    }

    class Textbook {
        +type: "book"
        +hasTeacherVersion: Boolean
        +selectEdition(edition: "student" | "teacher")
    }

    StoreProduct <|-- DigitalImprint
    StoreProduct <|-- Textbook

    class StoreBuySection {
        +renderCTA()
        +handleRoleSelection(role: RoleType)
    }

    class ExternalCheckoutModal {
        +fullName: String
        +emailAddress: String
        +whatsappNumber: String (Optional)
        +processPayment()
        +dispatchDownloadLink()
    }

    class InternalAuthFlow {
        +checkSession()
        +redirectToSignIn()
    }

    class WebReader {
        +verifyInstructorRole()
        +renderWebCopy()
    }

    Textbook --> StoreBuySection
    StoreBuySection --> ExternalCheckoutModal : "Routes 1 & 2 (External)"
    StoreBuySection --> InternalAuthFlow : "Routes 3 & 4 (Internal)"
    InternalAuthFlow --> WebReader : "Route 4 (Teacher Edition)"
```

---

## 4. Behavioral UML (User Flow / Activity Diagram)

This flowchart traces the exact logic a user experiences from the moment they click on a textbook CTA.

```mermaid
flowchart TD
    Start([User clicks 'Buy Book' on Textbook]) --> SelectEdition{Choose Edition}

    %% Edition Selection
    SelectEdition -->|Student Edition| RoleSelectStudent{Select Identity Role}
    SelectEdition -->|Teacher Edition| RoleSelectTeacher{Select Identity Role}

    %% -------------------------------------
    %% STUDENT EDITION BRANCH
    %% -------------------------------------
    RoleSelectStudent -->|1. Student| AuthPromptStudent[Sign In or Continue as Guest]
    RoleSelectStudent -->|2. Teacher/Parent| AuthPromptStudent

    %% External Flow
    AuthPromptStudent -->|Continue as Guest| ExtFlow[External Checkout Modal]
    ExtFlow --> ExtForm[Input: Name, Email, WhatsApp]
    ExtForm --> ExtPay[Process Payment]
    ExtPay --> ExtFulfill[Email PDF Download Link & Register Copy]

    %% Internal Student Flow
    AuthPromptStudent -->|Sign In| IntStudentFlow[Internal Auth Flow]
    IntStudentFlow --> AuthCheckS{Is Signed In?}
    AuthCheckS -->|No| SignInS[Redirect to Login]
    SignInS --> AuthCheckS
    AuthCheckS -->|Yes| IntPayS[Authenticated Payment Flow]
    IntPayS --> IntFulfillS[Add to Academy Dashboard & Download]


    %% -------------------------------------
    %% TEACHER EDITION BRANCH
    %% -------------------------------------
    RoleSelectTeacher -->|2. Teacher/Mentor| AuthPromptTeacher[Sign In or Continue as Guest]

    %% External Flow for Teacher
    AuthPromptTeacher -->|Continue as Guest| ExtFlow

    %% Internal Teacher Flow
    AuthPromptTeacher -->|Sign In| IntTeacherFlow[Internal Auth Flow]
    IntTeacherFlow --> AuthCheckT{Is Signed In?}
    AuthCheckT -->|No| SignInT[Redirect to Login]
    SignInT --> AuthCheckT
    AuthCheckT -->|Yes| VerifyRole{Is Valid Instructor?}
    
    VerifyRole -->|Yes| WebReader[Grant Access to Webcopy Reader]
    VerifyRole -->|No| Reject[Access Denied / Upgrade Required]

    %% Styling
    classDef external fill:#f8fafc,stroke:#cbd5e1,color:#0f172a
    classDef internal fill:#eff6ff,stroke:#93c5fd,color:#1d4ed8
    classDef auth fill:#fef3c7,stroke:#93c5fd,color:#b45309
    
    class ExtFlow,ExtForm,ExtPay,ExtFulfill external
    class IntStudentFlow,IntPayS,IntFulfillS internal
    class IntTeacherFlow,WebReader internal
    class AuthCheckS,AuthCheckT,SignInS,SignInT,AuthPromptStudent,AuthPromptTeacher auth
```

---

## 5. Implementation Roadmap

To align the current codebase with this architecture, we will execute the following steps sequentially:

1. **Update `TwoStepCheckoutModal.tsx` & Create `ExternalCheckoutModal.tsx`:** 
   - Separate the current monolithic modal. We need an explicit `ExternalCheckoutModal` capturing Name, Email, and WhatsApp.
2. **Refactor `StoreBuySection.tsx`:**
   - Modify the UI to first ask for the **Edition** (Student vs Teacher).
   - Upon selecting an edition, present a simplified choice: "Sign In" (primary) and "Continue as Guest" (secondary).
   - Clicking "Sign In" will trigger the `signIn()` flow.
   - "Continue as Guest" will open the `ExternalCheckoutModal`.
3. **Handle Authenticated Routing:**
   - Ensure that if a user signs in, they are brought back to the correct context.
   - For Hexadigitall Teachers accessing the Teacher Edition, route them directly to `/store/[slug]/reader` if their session verifies their instructor status.
4. **Clean up Imprints Flow:**
   - Ensure Imprints (which don't have Teacher/Student versions) bypass this complex role selection and jump straight to a simplified checkout.