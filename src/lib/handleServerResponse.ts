// UI: Shadcn-ui (https://ui.shadcn.com)
import { toast } from "@/components/ui/use-toast";
// Response interface 
interface IResponse {
    statusCode: number;
    message: string;
}
// Configuration
const duration: number = 3000;
// Handle server response
export function handleServerResponse(response: IResponse) {
    if (response.statusCode === 200) toast({ title: String(response.statusCode), description: response.message, variant: 'success', duration: duration });
    if (response.statusCode > 399) toast({ title: String(response.statusCode), description: response.message, variant: 'destructive', duration: duration });
	if (response instanceof Error) toast({ title: '500', description: 'Internal Server Error | ' + response.message, variant: 'destructive', duration: duration });
    return;
}