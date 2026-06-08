"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card, Input, Button } from "@/components/ui";

export default function SupportHubPage() {
  const router = useRouter();
  const [requestNumber, setRequestNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!requestNumber.trim()) return;
    
    setIsSearching(true);
    // Remove formatting if any and redirect
    const cleanNumber = requestNumber.trim().toUpperCase();
    router.push(`/admin/support/${cleanNumber}`);
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Support Hub" 
        description="Diagnose workflow routing issues, identify missing AD attributes, and reassign tasks." 
      />
      <div className="max-w-2xl mx-auto w-full mt-8">
        <Card title="Find Request (RFA)">
          <p className="text-sm text-gray-500 mb-6">Enter an RFA number to investigate its status, approval chain, or resolve workflow routing issues.</p>
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <Input 
                label="RFA Number" 
                name="requestNumber" 
                placeholder="e.g. RFA-42601" 
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit" isLoading={isSearching}>Search</Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
