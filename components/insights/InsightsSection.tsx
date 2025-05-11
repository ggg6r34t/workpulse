import React from "react";

import FocusMetrics from "@/components/FocusMetrics";
import ZapierIntegration from "@/components/ZapierIntegration";

const InsightsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
      <FocusMetrics />
      <ZapierIntegration />
    </div>
  );
};

export default InsightsSection;
