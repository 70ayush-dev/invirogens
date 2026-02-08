import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { Phone, Mail, Building2, CreditCard, Landmark, FileText } from "lucide-react";

const orderingMethods = [
  {
    title: "Telephone",
    value: "+886-8-736-7106",
    note: "Call to place your order directly.",
    icon: Phone,
  },
  {
    title: "Fax",
    value: "+886-8-736-7152",
    note: "Send your purchase request by fax.",
    icon: FileText,
  },
  {
    title: "Electronic Mail",
    value: "70ayush@gmail.com",
    note: "Send product list and quantities by email.",
    icon: Mail,
  },
];

const paymentMethods = [
  "Bank Check",
  "Wire Transfer",
];

const bankRows = [
  { label: "Bank", value: "Taiwan Cooperative Bank PINGNAN Branch" },
  { label: "SWIFT Code", value: "TACBTWTP122" },
  { label: "Address", value: "No.287, Minsheng Rd., Pingtung City, Pingtung County 900, Taiwan" },
  { label: "Account Name", value: "INVIROGENS Biotech Ltd." },
  { label: "Account Number", value: "1221898000249" },
];

export default function Order() {
  useSEO({
    title: "Ordering Info",
    description:
      "Ordering information for INVIROGENS products including phone, fax, email, and payment details.",
  });

  return (
    <div className="min-h-screen pt-20" data-testid="page-order">
      <section className="py-12 lg:py-16 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-3">
            <Building2 className="w-3 h-3 mr-1.5" />
            Contact & Distributors
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-order-title">
            Ordering Info
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg">
            You can purchase our products through the methods below.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {orderingMethods.map((method) => (
              <Card key={method.title}>
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <method.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground mb-1">{method.title}</h2>
                  <p className="text-sm font-medium text-primary break-all">{method.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{method.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Payment Information</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We accept payment through the following methods:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mb-6 space-y-1">
                {paymentMethods.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>

              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-foreground">Wire Transfer Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse" data-testid="table-order-bank">
                  <tbody>
                    {bankRows.map((row, idx) => (
                      <tr key={row.label} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                        <td className="w-40 px-3 py-2 border border-border font-medium text-foreground">
                          {row.label}
                        </td>
                        <td className="px-3 py-2 border border-border text-muted-foreground">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
