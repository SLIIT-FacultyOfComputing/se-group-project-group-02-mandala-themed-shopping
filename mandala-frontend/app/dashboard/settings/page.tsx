// app/dashboard/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("MandalaMarket");
  const [logoUrl, setLogoUrl] = useState("");

  const handleSave = () => {
    // Call API here
    toast.success("Settings saved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Store Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Store Name</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter your store name"
            />
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Paste image URL"
            />
          </div>
          <div>
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Preview"
                className="w-32 h-32 object-contain border rounded"
              />
            )}
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
