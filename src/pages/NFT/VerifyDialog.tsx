import { useData } from "../../contexts/DataContext";
import { CheckCircle2, XCircle, Shield } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface VerifyDialogProps {
  qrCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VerifyDialog = ({
  qrCode,
  open,
  onOpenChange,
}: VerifyDialogProps) => {
  const { getPurchasedTicketById } = useData();

  const ticket = getPurchasedTicketById(qrCode);
  const isValid = ticket && !ticket.isUsed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0A0A] border-[#00FF80]/30 max-w-md">
        <DialogHeader>
          <div className="text-center">
            <Shield className="text-[#00FF80] mx-auto mb-3" size={40} />
            <DialogTitle className="text-white text-center text-[1.5rem]">
              🧾 Ticket Verification
            </DialogTitle>
            <p className="text-gray-400 text-[0.875rem] mt-2">
              Blockchain-verified NFT ticket validation
            </p>
          </div>
        </DialogHeader>

        <div
          className={`rounded-2xl p-6 backdrop-blur-lg border-2 ${
            isValid
              ? "bg-[#00FF80]/10 border-[#00FF80] shadow-[0_0_30px_rgba(0,255,128,0.5)]"
              : "bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          } transition-all duration-500`}
        >
          <div className="text-center space-y-5">
            {isValid ? (
              <>
                <div className="relative">
                  <CheckCircle2
                    className="text-[#00FF80] mx-auto animate-pulse"
                    size={64}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#00FF80]/20 animate-ping" />
                  </div>
                </div>

                <div>
                  <h3 className="text-[#00FF80] mb-1">✅ Valid NFT Ticket</h3>
                  <p className="text-white text-[0.875rem]">
                    This ticket is authentic and ready to use
                  </p>
                </div>

                <div className="pt-4 border-t border-[#00FF80]/30 space-y-3 text-left">
                  <div>
                    <p className="text-gray-400 text-[0.75rem]">Event</p>
                    <p className="text-white text-[0.9375rem]">
                      {ticket.eventTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[0.75rem]">Artist</p>
                    <p className="text-white text-[0.9375rem]">
                      {ticket.artistName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[0.75rem]">Date</p>
                    <p className="text-white text-[0.9375rem]">
                      {new Date(ticket.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[0.75rem]">Venue</p>
                    <p className="text-white text-[0.9375rem]">
                      {ticket.venue}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[0.75rem]">
                      Owner Address
                    </p>
                    <p className="text-white font-mono text-[0.8125rem] break-all">
                      {ticket.ownerAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[0.75rem]">
                      Smart Contract
                    </p>
                    <p className="text-white font-mono text-[0.8125rem]">
                      {ticket.contractAddress}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <XCircle
                    className="text-red-500 mx-auto animate-pulse"
                    size={64}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                  </div>
                </div>

                <div>
                  <h3 className="text-red-500 mb-1">❌ Invalid Ticket</h3>
                  <p className="text-white text-[0.875rem]">
                    {ticket
                      ? "This ticket has already been used"
                      : "Ticket not found or has been invalidated"}
                  </p>
                </div>

                <div className="pt-4 border-t border-red-500/30">
                  <p className="text-gray-400 text-[0.875rem]">
                    This QR code is not valid. Please contact support if you
                    believe this is an error.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
