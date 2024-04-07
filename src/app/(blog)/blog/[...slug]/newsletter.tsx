"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const Newsletter = () => {
  const subscribeToNewsletterMutation =
    api.marketing.subscribeToNewsletter.useMutation({
      onSuccess: () => {
        toast.success("Subscribed to newsletter");
      },
    });
  const [email, setEmail] = React.useState("");

  return (
    <section className=" rounded-xl bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-md sm:text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight  text-white sm:text-4xl">
            Want to stay in the loop?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light  text-gray-500 sm:text-xl md:mb-12">
            I will send you bite-sized updated about my entrepreneurial journey
            once per week.
          </p>

          <div className=" mx-auto mb-3 max-w-screen-sm items-center space-y-4 sm:flex sm:space-y-0">
            <div className="relative w-full">
              <label className="mb-2 hidden text-sm font-medium  text-gray-300">
                Email address
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5  text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <input
                className=" focus:ring-primary-500 focus:border-primary-500 block h-10 w-full rounded-lg border border-gray-300 border-gray-600 bg-gray-50 bg-gray-700 p-3 pl-10 text-sm text-primary  text-white placeholder-gray-400 sm:rounded-none sm:rounded-l-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
              />
            </div>

            <Button
              disabled={!email || subscribeToNewsletterMutation.isPending}
              className="rounded-md sm:rounded-bl-none sm:rounded-tl-none "
              variant="secondary"
              onClick={() => {
                subscribeToNewsletterMutation.mutate({ email });
              }}
            >
              {subscribeToNewsletterMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
