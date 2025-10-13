flowchart TD
    A[Homepage] --> B["Explore Our Services<br>(Button)"]
    B --> C[/services]
    C --> D1["Service Card:<br>Learn More"]
    C --> D2["Service Card:<br>Purchase Service"]
    C --> D3["Service Card:<br>Contact/Get Quote"]
    D1 --> E["Service Detail Page<br>/services/{slug}"]
    D2 --> F["ServicePaymentModal<br>(Modal opens on Service Detail)"]
    D3 --> G["Contact Page<br>Pre-filled params"]

    E --> E1["Purchase Service (Button)"]
    E --> E2["Get Mobile App Quote (Button)"]
    E --> E3["Get Complete Solution Quote (Button)"]
    E --> E4["Related Services: Learn More (Button)"]
    E1 --> F
    E2 --> G
    E3 --> G
    E4 --> E

    F --> F1["Select Package"]
    F1 --> F2["Select Payment Plan"]
    F2 --> F3["Enter Details"]
    F3 --> F4["Purchase Service (Button)"]
    F4 --> G
    G --> H["Contact Form"]
    H --> I["Success Page:<br>/services/request/success"]

    %% Wizard Flow
    subgraph Wizard [Customization Wizard]
      W1["Step 1"]
      W2["Step 2"]
      W3["Step N"]
      W4["View Recommendations"]
      W5["Get Recommendation (Button)"]
      W1 --> W2 --> W3 --> W4 --> W5
      W5 --> G
    end

    %% Portfolio Flow
    P1[/portfolio]
    P1 --> P2["Project Card (Button)"]
    P2 --> P3["Project Detail:<br>/portfolio/{slug}"]

    %% Courses Flow
    C1[/courses]
    C1 --> C2["Learn More (Button)"]
    C2 --> C3["Course Detail:<br>/courses/{slug}"]

    %% Breadcrumbs/Back Navigation
    E -->|Breadcrumb| C
    P3 -->|Breadcrumb| P1
    C3 -->|Breadcrumb| C1