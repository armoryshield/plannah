// Default Manufacturing Master Plan Data Structure
export const defaultMasterPlan = {
  title: "Surge Master Plan",
  phases: [
    {
      id: "phase1",
      title: "Phase 1: Design for Manufacturing (DFM) and Design for Assembly (DFA)",
      description: "Optimize your functional prototype for mass production",
      tasks: [
        {
          id: "phase1-task1",
          title: "Review and Refine the Schematics",
          description: "Component selection, availability, cost-effectiveness, and second-source components for supply chain risk mitigation",
          timeEstimate: "1-2 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["schematics", "components", "supply-chain"],
          status: "pending",
          dependsOn: []
        },
        {
          id: "phase1-task2",
          title: "Optimize the PCB Layout",
          description: "Ensure component footprints, trace widths, clearances, layer stack-up, test points, and fiducials are optimized for manufacturing",
          timeEstimate: "2-3 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["pcb", "layout", "manufacturing"],
          status: "pending",
          dependsOn: ["phase1-task1"]
        },
        {
          id: "phase1-task3",
          title: "Mechanical Design Optimization",
          description: "Refine enclosure for injection molding, add draft angles, ribs, bosses, choose standard fasteners and connectors",
          timeEstimate: "2-4 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["mechanical", "enclosure", "molding"],
          status: "pending",
          dependsOn: []
        },
        {
          id: "phase1-task4",
          title: "Create Bill of Materials (BOM)",
          description: "Consolidate detailed BOM with part numbers, manufacturers, descriptions, quantities, and cost analysis",
          timeEstimate: "1 week",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["bom", "costing", "sourcing"],
          status: "pending",
          dependsOn: ["phase1-task1", "phase1-task2", "phase1-task3"]
        },
        {
          id: "phase1-task5",
          title: "DFM/DFA Review",
          description: "Schedule meeting with experienced hardware engineer or manufacturing consultant",
          timeEstimate: "1 week",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["review", "consultation"],
          status: "pending",
          dependsOn: ["phase1-task4"]
        }
      ]
    },
    {
      id: "phase2",
      title: "Phase 2: Sourcing and Supply Chain Management",
      description: "Build infrastructure to support production",
      tasks: [
        {
          id: "phase2-task1",
          title: "Find and Vet Manufacturing Partner",
          description: "Research Contract Manufacturer (CM) or EMS provider, send RFI/RFQ, conduct site visits/audits",
          timeEstimate: "2-4 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["manufacturing", "partner", "audit"],
          status: "pending",
          dependsOn: []
        },
        {
          id: "phase2-task2",
          title: "Develop Supply Chain Strategy",
          description: "Determine component sourcing approach (turnkey vs consigned), build vendor relationships",
          timeEstimate: "2-3 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["supply-chain", "vendors", "sourcing"],
          status: "pending",
          dependsOn: ["phase2-task1"]
        },
        {
          id: "phase2-task3",
          title: "Contract Negotiation",
          description: "Finalize contract including payment terms, lead times, quality standards, and NRE costs",
          timeEstimate: "1-2 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["contracts", "negotiation", "nre"],
          status: "pending",
          dependsOn: ["phase2-task2"]
        }
      ]
    },
    {
      id: "phase3",
      title: "Phase 3: Pre-Production and Tooling",
      description: "Bridge between design and mass production",
      tasks: [
        {
          id: "phase3-task1",
          title: "Tooling and Fixture Creation",
          description: "Create solder paste stencils, jigs, fixtures for assembly, and injection molds for enclosures",
          timeEstimate: "4-8 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["tooling", "fixtures", "molds"],
          status: "pending",
          dependsOn: []
        },
        {
          id: "phase3-task2",
          title: "Engineering Validation Test (EVT)",
          description: "Small batch production (10-50 units) to validate manufacturing process",
          timeEstimate: "1-2 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["evt", "validation", "testing"],
          status: "pending",
          dependsOn: ["phase3-task1"]
        },
        {
          id: "phase3-task3",
          title: "Design Validation Test (DVT)",
          description: "Larger batch (50-200 units) to ensure product meets design specifications and reliability requirements",
          timeEstimate: "2-3 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["dvt", "reliability", "testing"],
          status: "pending",
          dependsOn: ["phase3-task2"]
        }
      ]
    },
    {
      id: "phase4",
      title: "Phase 4: Production and Quality Control",
      description: "Mass production with comprehensive quality control",
      tasks: [
        {
          id: "phase4-task1",
          title: "First Article Inspection (FAI)",
          description: "Rigorous inspection of first production unit to ensure it matches design specifications",
          timeEstimate: "1 week",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["fai", "inspection", "quality"],
          status: "pending",
          dependsOn: []
        },
        {
          id: "phase4-task2",
          title: "Production Line Optimization",
          description: "Line balancing and optimization to meet production volume targets",
          timeEstimate: "1-2 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["production", "optimization", "volume"],
          status: "pending",
          dependsOn: ["phase4-task1"]
        },
        {
          id: "phase4-task3",
          title: "Quality Control Implementation",
          description: "Implement ICT, functional testing, EOL testing, sampling and audit procedures",
          timeEstimate: "2-3 weeks",
          scheduleDate: "",
          completedDate: "",
          assignee: "",
          sopDocument: "",
          tags: ["qc", "testing", "procedures"],
          status: "pending",
          dependsOn: ["phase4-task2"]
        }
      ]
    }
  ]
};