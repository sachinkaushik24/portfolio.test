/**
 * ====================================================================
 * SACHIN KAUSHIK - PORTFOLIO CONFIGURATION DATA
 * Professional, clean data structure for Sachin Kaushik
 * Includes authentic background imagery for projects, skills, and honors
 * ====================================================================
 */

const PORTFOLIO_DATA = {
  // Security Settings (Restricted to Sachin only)
  security: {
    adminPin: "2404", // Your private PIN
  },

  // Personal & Professional Details
  personal: {
    fullName: "Sachin Kaushik",
    firstName: "Sachin",
    lastName: "Kaushik",
    title: "Electronics & Communication Engineering Student",
    institution: "JECRC University, Jaipur",
    degreePeriod: "2026 — 2030 (1st Year)",
    location: "Jaipur, Rajasthan, India",
    statusBadge: "Available for Projects & Research",
    tagline: "First-year ECE undergraduate passionate about Embedded Firmware, Connected IoT Systems, Edge AI, and Robotics.",
    bio: "I am an Electronics & Communication Engineering undergraduate at JECRC University with a deep interest in hardware-software convergence. My focus centers on building reliable embedded systems, developing connected IoT sensor architectures, running machine learning inference on edge microcontrollers, and engineering autonomous robotics.",
    aboutDetailed: [
      "I am currently in my first year pursuing a Bachelor of Technology in Electronics and Communication Engineering (ECE) at JECRC University, Jaipur (2026–2030).",
      "Having secured 92.17% in Class 10 (2023) and 90.4% in Class 12 Science (2025), I combine strong analytical and mathematical fundamentals with an active hands-on enthusiasm for electronics and physical computing.",
      "My primary areas of interest include embedded C/C++ firmware development, microcontrollers (ESP32, STM32, Arduino), communication protocols (UART, SPI, I2C, MQTT), Edge AI/TinyML inference, and robotics kinematics. I am constantly building, prototyping on breadboards, and seeking technical learning opportunities."
    ],
    resumeUrl: "#", // Add 'resume.pdf' in the root directory or paste a Google Drive link
  },

  // Contact Information
  contact: {
    phone: "+91 9950436998",
    phoneRaw: "9950436998",
    email: "kaushiksachin240406@gmail.com",
    location: "Jaipur, Rajasthan, India",
    github: "https://github.com/sachinkaushik24",
    linkedin: "https://www.linkedin.com/in/sachin-kaushik-9a31a2440",
  },

  // Academic Education (Strictly verified years)
  education: [
    {
      degree: "Bachelor of Technology in Electronics & Communication Engineering (ECE)",
      institution: "JECRC University",
      period: "2026 — 2030 (1st Year)",
      score: "Pursuing",
      description: "Core coursework covering electronic circuit theory, digital logic, semiconductor devices, network theory, and foundational engineering mathematics.",
      badge: "Current Degree",
      icon: "graduation-cap"
    },
    {
      degree: "Senior Secondary (Class XII — Physics, Chemistry, Mathematics)",
      institution: "Lok Hitkari Adarsh Vidhya Mandir Sr Sec School",
      period: "2025",
      score: "90.4%",
      description: "Completed senior secondary education with high distinction in Mathematics and Science, building rigorous analytical and quantitative problem-solving foundations.",
      badge: "Board Distinction",
      icon: "school"
    },
    {
      degree: "Secondary School Examination (Class X)",
      institution: "Divine Angels Secondary School",
      period: "2023",
      score: "92.17%",
      description: "Secured top academic rank with 92.17% aggregate across comprehensive science, mathematics, and humanities curricula.",
      badge: "Academic Honors",
      icon: "award"
    }
  ],

  // Core Technical Focus Areas
  focusAreas: [
    {
      title: "Embedded Systems",
      icon: "microchip",
      description: "Firmware development, microcontroller programming (ESP32, Arduino, ARM Cortex), low-level GPIO control, and hardware peripheral interfacing."
    },
    {
      title: "Internet of Things (IoT)",
      icon: "wifi",
      description: "End-to-end connected sensor telemetry, cloud data streaming, MQTT and HTTP communication pipelines, and remote dashboard automation."
    },
    {
      title: "Edge AI & TinyML",
      icon: "brain",
      description: "Model optimization and deployment for resource-constrained embedded microcontrollers, local pattern recognition, and real-time inference without cloud latency."
    },
    {
      title: "Robotics & Automation",
      icon: "robot",
      description: "Sensor fusion, motor drivers (L298N, PWM control), obstacle detection algorithms, differential drive navigation, and closed-loop feedback systems."
    }
  ],

  // Technical Skills (Categorized chips with authentic background photography)
  skillCategories: [
    {
      category: "Microcontrollers & Hardware",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=900&q=80",
      skills: ["ESP32 / ESP8266", "Arduino (Uno / Nano)", "STM32 Basics", "Circuit Design", "Breadboard Prototyping", "Sensor Interfacing", "Actuators & Relays"]
    },
    {
      category: "Firmware & Programming",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
      skills: ["Embedded C", "C++", "Python", "GPIO Programming", "Timer & Interrupts", "Object-Oriented Programming", "Algorithm Design"]
    },
    {
      category: "Protocols & IoT",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80",
      skills: ["I2C", "SPI", "UART", "MQTT", "HTTP / REST APIs", "Wi-Fi & Bluetooth BLE", "Cloud Telemetry Dashboards"]
    },
    {
      category: "Tools & Software",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      skills: ["VS Code", "PlatformIO", "Arduino IDE", "Git & GitHub", "Linux Terminal", "Wokwi & Tinkercad Simulation", "Digital Multimeter & Oscilloscope Basics"]
    }
  ],

  // Engineering Projects (Authentic hardware imagery in background)
  projects: [
    {
      id: "esp32-weather-station",
      title: "ESP32 Cloud Telemetry Weather & Air Quality Node",
      category: "iot",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80",
      description: "An autonomous environmental telemetry device utilizing an ESP32 microcontroller with DHT22 temperature/humidity and MQ-135 air quality sensors. Streams environmental data over MQTT to an interactive telemetry dashboard with configurable alert thresholds.",
      hardware: ["ESP32", "DHT22 Sensor", "MQ-135 Sensor", "OLED Display 0.96\""],
      tags: ["ESP32", "C++", "MQTT", "IoT", "Sensors"],
      github: "https://github.com/sachinkaushik24",
      liveDemo: "#",
      featured: true
    },
    {
      id: "autonomous-rover",
      title: "Autonomous Obstacle Detection & Navigation Rover",
      category: "robotics",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
      description: "A differential-drive robotic vehicle designed with an ultrasonic distance sensor mounted on a micro-servo for directional sweep scanning. Employs state-machine obstacle avoidance logic and PWM motor speed regulation through an L298N H-bridge driver.",
      hardware: ["Arduino Uno", "HC-SR04 Ultrasonic", "SG90 Servo", "L298N Driver", "DC Gear Motors"],
      tags: ["Arduino", "C++", "Robotics", "Motor Control", "Sensors"],
      github: "https://github.com/sachinkaushik24",
      liveDemo: "#",
      featured: true
    },
    {
      id: "tinyml-edge-classifier",
      title: "Edge AI Physical Gesture & Motion Classifier",
      category: "edge-ai",
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=900&q=80",
      description: "An embedded TinyML prototype utilizing an MPU-6050 6-DOF IMU coupled with an ESP32. Captures accelerometer and gyroscope feature vectors, running a quantized neural network model directly on-device to classify physical movement patterns with minimal power draw.",
      hardware: ["ESP32", "MPU-6050 Accelerometer/Gyro", "I2C Bus"],
      tags: ["Edge AI", "TinyML", "ESP32", "Python", "Machine Learning"],
      github: "https://github.com/sachinkaushik24",
      liveDemo: "#",
      featured: true
    },
    {
      id: "relay-home-automation",
      title: "Multi-Channel Smart Home Automation Relay Node",
      category: "embedded",
      image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80",
      description: "A reliable AC appliance switching controller featuring optocoupler-isolated relay protection. Integrates local manual switch overrides alongside Wi-Fi remote switching, with automatic network failover recovery.",
      hardware: ["ESP8266/ESP32", "4-Channel Relay Module", "Optocouplers", "AC Power Supply"],
      tags: ["Embedded C++", "ESP8266", "Relays", "Home Automation"],
      github: "https://github.com/sachinkaushik24",
      liveDemo: "#",
      featured: false
    }
  ],

  // Academic Achievements & Honors (Authentic academic & workshop background imagery)
  achievements: [
    {
      title: "Senior Secondary (Class XII) Academic Distinction — 90.4%",
      issuer: "Lok Hitkari Adarsh Vidhya Mandir Sr Sec School",
      date: "2025",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
      credentialUrl: "#",
      description: "Secured 90.4% in Board Examinations with distinction in Physics, Chemistry, and Mathematics.",
      badge: "Board Merit"
    },
    {
      title: "Secondary School (Class X) Academic Distinction — 92.17%",
      issuer: "Divine Angels Secondary School",
      date: "2023",
      image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=900&q=80",
      credentialUrl: "#",
      description: "Graduated with 92.17% aggregate, receiving high academic honors for outstanding performance across all subjects.",
      badge: "Top Academic Rank"
    },
    {
      title: "Admission to B.Tech ECE at JECRC University",
      issuer: "JECRC University, Jaipur",
      date: "2026",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
      credentialUrl: "#",
      description: "Commenced undergraduate studies in Electronics & Communication Engineering (2026 — 2030).",
      badge: "Undergraduate Milestone"
    },
    {
      title: "Embedded Systems & IoT Technical Workshop",
      issuer: "Technical Foundations",
      date: "2026",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=900&q=80",
      credentialUrl: "#",
      description: "Hands-on development covering microcontroller peripheral architecture, digital communications, and wireless IoT nodes.",
      badge: "Technical Skill"
    }
  ]
};

// Global browser exposure
if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
