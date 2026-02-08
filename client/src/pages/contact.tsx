import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  Clock,
  FlaskConical,
} from "lucide-react";
import { insertContactSchema } from "@shared/schema";
import type { InsertContact } from "@shared/schema";

const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "c27a8c59-aaab-40e9-b428-bd53f651eb4a";

const contactInfo = [
  { icon: Mail, label: "Email", value: "70ayush@gmail.com", href: "mailto:70ayush@gmail.com" },
  { icon: Phone, label: "TEL", value: "+886-8-736-7106", href: "tel:+88687367106" },
  { icon: Phone, label: "Mobile", value: "+886-982-951-501", href: "tel:+886982951501" },
  { icon: MapPin, label: "Address", value: "No. 82, Ln. 11, Tantou Rd., Changzhi Township, Pingtung County 908, R.O.C." },
  { icon: Clock, label: "FAX", value: "+886-8-736-7152" },
  { icon: Globe, label: "Distribution", value: "30+ countries worldwide" },
];

export default function Contact() {
  const { toast } = useToast();

  useSEO({
    title: "Contact Us",
    description: "Contact INVIROGENS: +886-8-736-7106. If you are interested in our products or have any suggestion, please contact us.",
  });

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: data.subject || "Website Contact Inquiry",
          from_name: data.name,
          name: data.name,
          email: data.email,
          company: data.company || "N/A",
          message: data.message,
          botcheck: "",
        }),
      });

      const body = await res.json();
      if (!res.ok || body?.success !== true) {
        throw new Error(body?.message || "Web3Forms submission failed");
      }

      return body;
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 1-2 business days.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-12 lg:py-16 bg-card border-b" data-testid="section-contact-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-3">
            <Mail className="w-3 h-3 mr-1.5" />
            Get in Touch
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            If you are interested in our products or have any suggestion, please contact us.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16" data-testid="section-contact-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold text-foreground mb-6">Send a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company" {...field} value={field.value || ""} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Product inquiry" {...field} data-testid="input-subject" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your needs..."
                            className="resize-none min-h-[140px]"
                            {...field}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-contact">
                    {mutation.isPending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <Card key={info.label} data-testid={`card-contact-${info.label.toLowerCase().replace(/\s/g, "-")}`}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FlaskConical className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">Distributors</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    INVIROGENS will establish distributors in Japan, Korea, India, Europe, Pakistan, China and USA, and covers 30+ countries with dedicated distributors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
