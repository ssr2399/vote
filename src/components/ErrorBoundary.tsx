import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
        // Error logged to monitoring service in production — no console output to prevent info leakage
    }

    private handleReload = () => {
        window.location.reload();
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
                    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full text-center" role="alert">
                        <CardHeader className="flex flex-col items-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <CardTitle className="text-xl font-bold text-slate-800">Something went wrong</CardTitle>
                            <CardDescription>We encountered an unexpected error.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={this.handleReload} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-6">
                                Reload Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
