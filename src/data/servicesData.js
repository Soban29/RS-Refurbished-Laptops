export const REPAIR_SERVICES = [
  {
    id: "serv-01",
    title: "Chip-Level Motherboard Repair",
    tagline: "Component-level micro-soldering & power IC fixes",
    icon: "Cpu",
    startingPrice: 1499,
    turnaround: "24 - 48 Hours",
    description: "No-display, short circuits, water damage, power button non-responsive, or dead laptop recovery using high-precision infrared rework stations.",
    includes: [
      "Micro-soldering & IC replacement",
      "Short-circuit diagnostics & ultrasonic cleaning",
      "Power management IC (PMIC) repair",
      "90-Day Service Warranty"
    ],
    badge: "Specialized Lab"
  },
  {
    id: "serv-02",
    title: "Original Screen & Display Replacement",
    tagline: "Crisp IPS, OLED, FHD, and 4K display panels",
    icon: "Monitor",
    startingPrice: 1999,
    turnaround: "Same Day (2 Hours)",
    description: "Cracked screens, lines on display, backlight failure, flickering, or hinge damage repaired with 100% OEM tested grade-A displays.",
    includes: [
      "Zero dead pixel guarantee",
      "Matte anti-glare & glossy options",
      "Hinge lubrication & alignment check",
      "6-Month Replacement Warranty"
    ],
    badge: "Same-Day Fix"
  },
  {
    id: "serv-03",
    title: "RAM & NVMe SSD Super-Speed Upgrade",
    tagline: "Make any old laptop 5x to 10x faster instantly",
    icon: "HardDrive",
    startingPrice: 1199,
    turnaround: "30 - 45 Minutes",
    description: "Upgrade mechanical HDDs to blazing fast NVMe/SATA SSDs and expand RAM to 16GB/32GB/64GB with zero data loss cloning.",
    includes: [
      "100% Data preservation & seamless OS clone",
      "High-speed Kingston / Crucial / Samsung drives",
      "Boot time reduction under 10 seconds",
      "3-Year Brand Warranty on SSD/RAM"
    ],
    badge: "10x Speed Boost"
  },
  {
    id: "serv-04",
    title: "Battery & Precision Keyboard Replacement",
    tagline: "Restore all-day battery life and typing feel",
    icon: "BatteryCharging",
    startingPrice: 1299,
    turnaround: "1 - 2 Hours",
    description: "Swollen batteries, dead cells, sticky keys, liquid spills, or non-functional backlights replaced with genuine OEM replacements.",
    includes: [
      "High capacity Li-ion & Li-Polymer cells",
      "Original spill-resistant backlit keyboards",
      "Safe battery health calibration",
      "6-Month to 1-Year Warranty"
    ],
    badge: "Long Life Cells"
  },
  {
    id: "serv-05",
    title: "Deep Thermal Servicing & Tuning",
    tagline: "Cure overheating, fan noise & performance throttling",
    icon: "Wind",
    startingPrice: 499,
    turnaround: "45 Minutes",
    description: "Ultrasonic fan blade cleaning, copper heatsink de-clogging, and application of premium Arctic MX-4 / Noctua thermal paste.",
    includes: [
      "Drop CPU/GPU temps by 10°C - 20°C",
      "Eliminate thermal throttling lag in games & apps",
      "Fan bearing lubrication & noise reduction",
      "Comprehensive stress-test verification"
    ],
    badge: "Performance Tune"
  },
  {
    id: "serv-06",
    title: "Enterprise AMC & Fleet Maintenance",
    tagline: "Dedicated IT support for startups, offices & factories",
    icon: "ShieldCheck",
    startingPrice: 450,
    unit: "per laptop / month",
    turnaround: "Dedicated SLA",
    description: "Comprehensive preventative maintenance, standby backup laptops, antivirus security, and on-site support for business IT fleets.",
    includes: [
      "Quarterly physical & software health audits",
      "Same-day standby replacement laptops",
      "Unlimited remote & on-site IT support",
      "Fleet asset tagging & lifecycle tracking"
    ],
    badge: "Enterprise SLA"
  }
];

export const QUALITY_INSPECTION_POINTS = [
  { group: "Core Hardware", points: ["CPU benchmark & stress test", "RAM memory test (MemTest86)", "Motherboard power rails & IC stability", "Thermal dissipation & fan noise"] },
  { group: "Display & Graphics", points: ["Zero dead pixel / tint check", "Brightness uniformity test", "GPU stress under 3D load", "Display hinge torque & angle test"] },
  { group: "Battery & Power", points: ["Battery health > 85%-95%", "Charge/discharge cycle analysis", "Original adapter voltage test", "Sleep & wake power consumption"] },
  { group: "I/O & Connectivity", points: ["All USB / Type-C & Thunderbolt ports", "Wi-Fi 6 & Bluetooth signal strength", "HDMI / DisplayPort video out", "SD Card reader & RJ45 LAN"] },
  { group: "Input & Media", points: ["Every single keyboard key responsiveness", "Precision multi-touch trackpad & gestures", "Webcam resolution & privacy slider", "Stereo audio & dual microphone clarity"] },
  { group: "Cosmetic & Sanitization", points: ["Grade classification inspection", "Ultrasonic casing sanitization", "No heavy dents or cracks guarantee", "Clean OS installation with genuine licenses"] }
];
