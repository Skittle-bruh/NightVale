import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ExternalLink } from "lucide-react";
import { SiDiscord } from "react-icons/si";

interface DiscordWidgetProps {
  serverId?: string;
  inviteLink?: string;
}

export default function DiscordWidget({
  serverId = "YOUR_SERVER_ID",
  inviteLink = "https://discord.gg/your-invite",
}: DiscordWidgetProps) {
  const hasValidServerId = serverId !== "YOUR_SERVER_ID" && serverId.length > 0;

  return (
    <Card className="overflow-hidden" data-testid="discord-widget">
      <CardHeader className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-violet-400" />
          Join Our Community
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {hasValidServerId ? (
          <iframe
            src={`https://discord.com/widget?id=${serverId}&theme=dark`}
            width="100%"
            height="350"
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            title="Discord Server Widget"
            className="bg-card"
            data-testid="iframe-discord"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20">
              <SiDiscord className="h-8 w-8 text-[#5865F2]" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Connect with us on Discord</p>
              <p className="text-sm text-muted-foreground">
                Join our community to get updates, share feedback, and chat with other users.
              </p>
            </div>
            <Button
              className="w-full bg-[#5865F2] text-white hover:bg-[#4752C4]"
              onClick={() => window.open(inviteLink, "_blank")}
              data-testid="button-join-discord"
            >
              <SiDiscord className="mr-2 h-4 w-4" />
              Join Discord
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
