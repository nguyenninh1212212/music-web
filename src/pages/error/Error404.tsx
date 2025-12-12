import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function Error404() {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl text-white mb-2">Error</h2>
            <p className="text-gray-400 mb-6">Could not load this page</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
