CREATE TABLE "adaptive_learning_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"system_iq" integer DEFAULT 150 NOT NULL,
	"adaptation_level" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"learning_progress" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"translation_accuracy" numeric(5, 4) DEFAULT '0.9400',
	"response_speed" integer DEFAULT 800,
	"user_satisfaction_score" numeric(3, 2) DEFAULT '4.50',
	"total_interactions" integer DEFAULT 0,
	"successful_predictions" integer DEFAULT 0,
	"model_version" varchar DEFAULT 'v1.0.0',
	"last_optimization_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "age_verifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"verification_type" varchar NOT NULL,
	"document_number" varchar NOT NULL,
	"document_image_url" varchar,
	"birth_date" timestamp NOT NULL,
	"age" integer NOT NULL,
	"is_over18" boolean NOT NULL,
	"is_over21" boolean NOT NULL,
	"status" varchar DEFAULT 'pending',
	"verified_by" varchar,
	"verification_date" timestamp,
	"expiry_date" timestamp,
	"rejection_reason" text,
	"resubmission_allowed" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "agent_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_type" varchar NOT NULL,
	"action" varchar NOT NULL,
	"status" varchar NOT NULL,
	"message" text,
	"task_id" varchar,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_advisory_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"advisor_type" varchar NOT NULL,
	"report_type" varchar NOT NULL,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"title" varchar NOT NULL,
	"summary" text NOT NULL,
	"details" text,
	"recommendations" jsonb,
	"metrics" jsonb,
	"status" varchar DEFAULT 'unread',
	"action_required" boolean DEFAULT false,
	"due_date" timestamp,
	"tags" jsonb,
	"generated_at" timestamp DEFAULT now(),
	"read_at" timestamp,
	"action_taken_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" varchar NOT NULL,
	"required_role" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"actor_id" varchar,
	"comments" text,
	"approved_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ar_scanners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"service_area" jsonb,
	"equipment" jsonb,
	"certification_level" varchar DEFAULT 'basic',
	"certification_date" timestamp,
	"scan_accuracy" numeric(3, 2) DEFAULT '95.0',
	"total_scans" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"completion_rate" numeric(3, 2) DEFAULT '100.0',
	"average_turnaround" numeric(4, 1),
	"basic_scan_price" numeric(8, 2),
	"premium_scan_price" numeric(8, 2),
	"rush_job_multiplier" numeric(3, 2) DEFAULT '1.5',
	"is_active" boolean DEFAULT true,
	"available_hours" jsonb,
	"current_bookings" integer DEFAULT 0,
	"max_bookings_per_day" integer DEFAULT 3,
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ar_scans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar NOT NULL,
	"scanner_user_id" varchar NOT NULL,
	"scan_type" varchar NOT NULL,
	"device_used" varchar,
	"scan_resolution" varchar,
	"point_cloud_size" integer,
	"point_cloud_url" varchar,
	"mesh_model_url" varchar,
	"textured_model_url" varchar,
	"floor_plan_url" varchar,
	"room_data" jsonb,
	"total_rooms" integer,
	"total_square_footage" numeric(8, 2),
	"ceiling_heights" jsonb,
	"wall_dimensions" jsonb,
	"window_dimensions" jsonb,
	"door_dimensions" jsonb,
	"accuracy_score" numeric(3, 2),
	"completeness_score" numeric(3, 2),
	"visual_quality" numeric(3, 2),
	"processing_status" varchar DEFAULT 'processing',
	"processing_progress" integer DEFAULT 0,
	"error_message" text,
	"scan_duration" integer,
	"file_size" numeric(8, 2),
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth_policies" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"min_session_minutes" integer DEFAULT 30,
	"cooldown_minutes" integer DEFAULT 15,
	"grace_before" integer DEFAULT 10,
	"grace_after" integer DEFAULT 10,
	"single_session_only" boolean DEFAULT true,
	"device_bind_days" integer DEFAULT 14,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "authentication_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"device_id" varchar,
	"auth_method" varchar NOT NULL,
	"success" boolean NOT NULL,
	"ip_address" varchar,
	"user_agent" text,
	"location" varchar,
	"risk_score" numeric(5, 2),
	"blocked_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "autonomous_tasks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"obligation_id" varchar,
	"kind" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"due_at" timestamp NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"requires_approval" boolean DEFAULT false,
	"auto_execute" boolean DEFAULT false,
	"executed_at" timestamp,
	"executed_by" varchar,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"last_error" text,
	"metadata" jsonb,
	"created_by" varchar DEFAULT 'system' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "availability_alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"property_type" varchar,
	"category" varchar,
	"parish" varchar,
	"max_budget" numeric(10, 2),
	"min_bedrooms" integer,
	"required_amenities" jsonb,
	"alert_frequency" varchar DEFAULT 'instant',
	"is_active" boolean DEFAULT true,
	"notify_email" boolean DEFAULT true,
	"notify_sms" boolean DEFAULT true,
	"notify_whatsapp" boolean DEFAULT true,
	"notify_push" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "broker_regions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"broker_id" varchar NOT NULL,
	"parish" varchar NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brokers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"gov_id" varchar,
	"verified" boolean DEFAULT false,
	"rating" numeric(3, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "browser_bookmarks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"url" text NOT NULL,
	"favicon_url" varchar,
	"category" varchar DEFAULT 'general',
	"tags" jsonb,
	"sort_order" integer DEFAULT 0,
	"is_trusted" boolean DEFAULT false,
	"last_verified" timestamp,
	"security_notes" text,
	"visit_count" integer DEFAULT 0,
	"last_visited" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "browser_security_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"severity" varchar DEFAULT 'medium',
	"threat_url" text,
	"threat_type" varchar,
	"threat_description" text,
	"action_taken" varchar NOT NULL,
	"user_response" varchar,
	"referrer_url" text,
	"browser_data" jsonb,
	"is_resolved" boolean DEFAULT false,
	"resolution_notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_access_controls" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_business_type" varchar NOT NULL,
	"to_business_type" varchar NOT NULL,
	"category" varchar NOT NULL,
	"can_view_products" boolean DEFAULT true,
	"can_view_pricing" boolean DEFAULT true,
	"can_place_orders" boolean DEFAULT true,
	"can_request_quotes" boolean DEFAULT true,
	"min_verification_level" varchar DEFAULT 'basic',
	"min_order_value" numeric(10, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"business_type" varchar NOT NULL,
	"business_category" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"business_registration" varchar,
	"business_license" varchar,
	"trading_name" varchar,
	"is_verified" boolean DEFAULT false,
	"verification_level" varchar DEFAULT 'pending',
	"verification_documents" jsonb,
	"business_address" text NOT NULL,
	"business_phone" varchar NOT NULL,
	"business_email" varchar NOT NULL,
	"website" varchar,
	"established_year" integer,
	"employee_count" varchar,
	"annual_revenue" varchar,
	"minimum_order_value" numeric(10, 2),
	"payment_terms" varchar DEFAULT 'net_30',
	"credit_limit" numeric(12, 2),
	"sells_to" jsonb,
	"buys_from" jsonb,
	"allowed_categories" jsonb,
	"total_orders" integer DEFAULT 0,
	"total_value" numeric(12, 2) DEFAULT '0',
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"payment_history" varchar DEFAULT 'excellent',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_expenses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar NOT NULL,
	"name" varchar NOT NULL,
	"provider" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"frequency" varchar NOT NULL,
	"next_due_date" timestamp NOT NULL,
	"last_paid_date" timestamp,
	"auto_renewal" boolean DEFAULT false,
	"auto_payment" boolean DEFAULT false,
	"payment_method_id" varchar,
	"stripe_subscription_id" varchar,
	"vendor_profile_id" varchar,
	"payment_status" varchar DEFAULT 'pending',
	"last_payment_attempt" timestamp,
	"next_payment_retry" timestamp,
	"payment_failure_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"alert_days" integer DEFAULT 30,
	"description" text,
	"invoice_url" text,
	"status" varchar DEFAULT 'upcoming',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_goals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"target_value" numeric(15, 2) NOT NULL,
	"current_value" numeric(15, 2) DEFAULT '0.00',
	"unit" varchar NOT NULL,
	"target_date" timestamp NOT NULL,
	"status" varchar DEFAULT 'in_progress',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"tagline" text,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"subcategory" varchar,
	"business_type" varchar DEFAULT 'individual',
	"phone" varchar,
	"email" varchar,
	"whatsapp_number" varchar,
	"address" text,
	"parish" varchar,
	"services_area" jsonb,
	"profile_image_url" varchar,
	"cover_image_url" varchar,
	"portfolio_images" jsonb,
	"video_intro_url" varchar,
	"services" jsonb,
	"starting_price" numeric(10, 2),
	"currency" varchar DEFAULT 'JMD',
	"payment_methods" jsonb,
	"working_hours" jsonb,
	"available_days" jsonb,
	"is_available" boolean DEFAULT true,
	"response_time" varchar DEFAULT 'within_1_hour',
	"is_age_verified" boolean DEFAULT false,
	"age_verification_date" timestamp,
	"requires_age_verification" boolean DEFAULT false,
	"compliance_level" varchar DEFAULT 'standard',
	"social_username" varchar,
	"website_url" varchar,
	"total_bookings" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"response_rate" numeric(5, 2) DEFAULT '100.0',
	"completion_rate" numeric(5, 2) DEFAULT '100.0',
	"is_published" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"keywords" jsonb,
	"seo_title" varchar,
	"seo_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "business_profiles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "business_profiles_social_username_unique" UNIQUE("social_username")
);
--> statement-breakpoint
CREATE TABLE "business_verifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_account_id" varchar NOT NULL,
	"verification_type" varchar NOT NULL,
	"document_type" varchar,
	"document_url" varchar,
	"document_number" varchar,
	"status" varchar DEFAULT 'pending',
	"verified_by" varchar,
	"verification_date" timestamp,
	"expiry_date" timestamp,
	"rejection_reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "car_rental_bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_booking_id" varchar NOT NULL,
	"pickup_location" varchar NOT NULL,
	"dropoff_location" varchar NOT NULL,
	"pickup_date" date NOT NULL,
	"dropoff_date" date NOT NULL,
	"car_type" varchar NOT NULL,
	"car_make" varchar,
	"car_model" varchar,
	"transmission" varchar DEFAULT 'automatic',
	"fuel_type" varchar DEFAULT 'gasoline',
	"insurance" boolean DEFAULT false,
	"gps_navigation" boolean DEFAULT false,
	"driver_age" integer,
	"additional_drivers" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cashback_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"transaction_type" varchar NOT NULL,
	"amount" numeric(8, 2) NOT NULL,
	"description" text,
	"related_job_id" varchar,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cb_channel_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" varchar NOT NULL,
	"channel_id" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cb_radio_channels" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel_number" integer NOT NULL,
	"channel_name" varchar NOT NULL,
	"description" text,
	"is_emergency_channel" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"region" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cb_radio_channels_channel_number_unique" UNIQUE("channel_number")
);
--> statement-breakpoint
CREATE TABLE "cb_radio_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_call_sign" varchar NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar DEFAULT 'chat' NOT NULL,
	"priority" varchar DEFAULT 'normal' NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"is_location_shared" boolean DEFAULT false,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ceo_dashboard_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_type" varchar NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"unit" varchar,
	"period" varchar NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"message_type" varchar DEFAULT 'text' NOT NULL,
	"original_text" text,
	"original_lang" varchar,
	"lang_confidence" numeric(5, 2) DEFAULT '0.95',
	"voice_file_url" varchar,
	"voice_duration" integer,
	"image_url" varchar,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"toxicity_score" numeric(5, 2) DEFAULT '0.01',
	"is_safe" boolean DEFAULT true,
	"is_reported" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_participants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar DEFAULT 'participant',
	"joined_at" timestamp DEFAULT now(),
	"left_at" timestamp,
	"is_active" boolean DEFAULT true,
	"preferred_lang_override" varchar,
	"always_show_original" boolean DEFAULT false,
	"always_show_english" boolean DEFAULT false,
	"last_read_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "communication_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" varchar NOT NULL,
	"communication_type" varchar NOT NULL,
	"participant_type" varchar NOT NULL,
	"participant_id" varchar,
	"participant_name" varchar,
	"contact_method" varchar,
	"message_content" text NOT NULL,
	"ai_generated" boolean DEFAULT false,
	"human_reviewed" boolean DEFAULT false,
	"escalated_to_human" boolean DEFAULT false,
	"escalation_reason" varchar,
	"response_required" boolean DEFAULT false,
	"response_deadline" timestamp,
	"response_provided" boolean DEFAULT false,
	"sentiment" varchar,
	"urgency" varchar DEFAULT 'normal',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"industry" varchar NOT NULL,
	"description" text,
	"email" varchar,
	"phone" varchar,
	"address" text,
	"city" varchar,
	"country" varchar DEFAULT 'JM',
	"logo_url" varchar,
	"is_verified" boolean DEFAULT false,
	"rating" numeric(3, 2) DEFAULT '5.00',
	"total_jobs" integer DEFAULT 0,
	"active_jobs" integer DEFAULT 0,
	"business_terms_accepted" boolean DEFAULT false NOT NULL,
	"business_partner_agreement_accepted" boolean DEFAULT false NOT NULL,
	"business_privacy_accepted" boolean DEFAULT false NOT NULL,
	"legal_accepted_at" timestamp,
	"business_terms_version" varchar DEFAULT '1.0',
	"business_agreement_version" varchar DEFAULT '1.0',
	"business_privacy_version" varchar DEFAULT '1.0',
	"ip_address_at_acceptance" varchar,
	"user_agent_at_acceptance" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_guidelines" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"requirements" jsonb,
	"prohibited_content" jsonb,
	"recommended_practices" jsonb,
	"compliance_level" varchar DEFAULT 'standard',
	"is_required" boolean DEFAULT true,
	"full_guidelines" text NOT NULL,
	"examples" jsonb,
	"resources" jsonb,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "corporate_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_job_id" varchar NOT NULL,
	"partner_id" varchar NOT NULL,
	"yardflex_tracking_number" varchar NOT NULL,
	"job_type" varchar NOT NULL,
	"priority" varchar DEFAULT 'standard',
	"service_type" varchar DEFAULT 'standard',
	"pickup_address" text NOT NULL,
	"pickup_coordinates" jsonb,
	"pickup_contact" varchar NOT NULL,
	"pickup_phone" varchar NOT NULL,
	"pickup_instructions" text,
	"pickup_time_window" jsonb,
	"delivery_address" text NOT NULL,
	"delivery_coordinates" jsonb,
	"recipient_name" varchar NOT NULL,
	"recipient_phone" varchar,
	"delivery_instructions" text,
	"delivery_time_window" jsonb,
	"package_count" integer DEFAULT 1,
	"total_weight" numeric(8, 3),
	"dimensions" jsonb,
	"package_value" numeric(10, 2),
	"is_fragile" boolean DEFAULT false,
	"requires_signature" boolean DEFAULT false,
	"requires_id_check" boolean DEFAULT false,
	"partner_rate" numeric(8, 2),
	"driver_payout" numeric(8, 2),
	"yardflex_margin" numeric(8, 2),
	"assigned_driver_id" varchar,
	"status" varchar DEFAULT 'pending',
	"assigned_at" timestamp,
	"picked_up_at" timestamp,
	"delivered_at" timestamp,
	"sla_deadline" timestamp,
	"sla_status" varchar DEFAULT 'on_track',
	"partner_notified" boolean DEFAULT false,
	"customer_rating" numeric(3, 2),
	"partner_feedback" text,
	"issue_reports" jsonb,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	CONSTRAINT "corporate_jobs_yardflex_tracking_number_unique" UNIQUE("yardflex_tracking_number")
);
--> statement-breakpoint
CREATE TABLE "corporate_performance" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"period" varchar NOT NULL,
	"period_date" date NOT NULL,
	"total_jobs" integer DEFAULT 0,
	"completed_jobs" integer DEFAULT 0,
	"failed_jobs" integer DEFAULT 0,
	"cancelled_jobs" integer DEFAULT 0,
	"on_time_deliveries" integer DEFAULT 0,
	"on_time_percentage" numeric(5, 2),
	"average_delivery_time" numeric(5, 1),
	"customer_satisfaction_score" numeric(3, 2),
	"total_revenue" numeric(10, 2),
	"total_driver_payouts" numeric(10, 2),
	"total_yardflex_earnings" numeric(10, 2),
	"average_job_value" numeric(8, 2),
	"damage_reports" integer DEFAULT 0,
	"lost_packages" integer DEFAULT 0,
	"customer_complaints" integer DEFAULT 0,
	"issue_resolution_time" numeric(5, 1),
	"total_drivers_used" integer,
	"peak_hour_demand" integer,
	"capacity_utilization" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cost_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period" varchar NOT NULL,
	"period_date" date NOT NULL,
	"traditional_shipping_cost" numeric(10, 2) DEFAULT '0',
	"yardflex_shipping_cost" numeric(10, 2) DEFAULT '0',
	"cost_savings" numeric(10, 2) DEFAULT '0',
	"savings_percentage" numeric(5, 2) DEFAULT '0',
	"total_shipments" integer DEFAULT 0,
	"average_delivery_time" numeric(5, 2),
	"on_time_deliveries" integer DEFAULT 0,
	"customer_satisfaction_score" numeric(3, 2) DEFAULT '5.0',
	"total_distance_saved" numeric(10, 2) DEFAULT '0',
	"fuel_saved" numeric(8, 2) DEFAULT '0',
	"co2_reduced" numeric(8, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_promotions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"min_top_up_jmd" numeric(10, 2),
	"bonus_amount_jmd" numeric(10, 2),
	"bonus_percent" integer,
	"valid_from" timestamp DEFAULT now(),
	"valid_until" timestamp,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "credit_promotions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "credit_top_ups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" varchar NOT NULL,
	"amount_jmd" numeric(10, 2) NOT NULL,
	"bonus_jmd" numeric(10, 2) DEFAULT '0.00',
	"payment_method" varchar NOT NULL,
	"provider_ref_id" varchar,
	"status" varchar DEFAULT 'pending',
	"meta" jsonb,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"amount_jmd" numeric(10, 2) NOT NULL,
	"balance_before_jmd" numeric(10, 2) NOT NULL,
	"balance_after_jmd" numeric(10, 2) NOT NULL,
	"reference_type" varchar,
	"reference_id" varchar,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_transfers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_wallet_id" varchar NOT NULL,
	"to_wallet_id" varchar NOT NULL,
	"amount_jmd" numeric(10, 2) NOT NULL,
	"reason" text,
	"status" varchar DEFAULT 'completed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"balance_jmd" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"bonus_credits_jmd" numeric(10, 2) DEFAULT '0.00',
	"total_top_ups" numeric(12, 2) DEFAULT '0.00',
	"total_spent" numeric(12, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "credit_wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "customer_reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"customer_id" varchar,
	"rating" integer NOT NULL,
	"title" varchar,
	"content" text NOT NULL,
	"images" jsonb,
	"customer_name" varchar,
	"customer_phone" varchar,
	"service_type" varchar,
	"service_cost" numeric(10, 2),
	"service_date" timestamp,
	"is_verified" boolean DEFAULT false,
	"verification_method" varchar,
	"is_approved" boolean DEFAULT true,
	"moderation_notes" text,
	"can_use_in_marketing" boolean DEFAULT true,
	"featured_in_posts" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_areas" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"boundaries" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"delivery_fee_multiplier" numeric(3, 2) DEFAULT '1.00',
	"estimated_delivery_time" integer DEFAULT 30,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_areas_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "delivery_categories" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon" varchar,
	"base_rate" numeric(8, 2) NOT NULL,
	"rate_per_km" numeric(6, 2) NOT NULL,
	"min_fee" numeric(6, 2) NOT NULL,
	"max_fee" numeric(8, 2),
	"is_active" boolean DEFAULT true,
	"requires_special_handling" boolean DEFAULT false,
	"allowed_vehicle_types" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "delivery_earnings" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_personnel_id" varchar(36) NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"base_earning" numeric(8, 2) NOT NULL,
	"distance_bonus" numeric(8, 2) DEFAULT '0.00',
	"time_bonus" numeric(8, 2) DEFAULT '0.00',
	"tip_earning" numeric(8, 2) DEFAULT '0.00',
	"priority_bonus" numeric(8, 2) DEFAULT '0.00',
	"total_earning" numeric(8, 2) NOT NULL,
	"platform_fee" numeric(8, 2) DEFAULT '0.00',
	"net_earning" numeric(8, 2) NOT NULL,
	"payout_status" varchar DEFAULT 'pending',
	"paid_at" timestamp,
	"earned_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_orders" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar NOT NULL,
	"customer_id" varchar(36) NOT NULL,
	"delivery_personnel_id" varchar(36),
	"delivery_type" varchar NOT NULL,
	"pickup_address" text NOT NULL,
	"pickup_lat" numeric(10, 7) NOT NULL,
	"pickup_lng" numeric(10, 7) NOT NULL,
	"pickup_contact_name" varchar,
	"pickup_contact_phone" varchar,
	"pickup_instructions" text,
	"delivery_address" text NOT NULL,
	"delivery_lat" numeric(10, 7) NOT NULL,
	"delivery_lng" numeric(10, 7) NOT NULL,
	"delivery_contact_name" varchar NOT NULL,
	"delivery_contact_phone" varchar NOT NULL,
	"delivery_instructions" text,
	"items" jsonb NOT NULL,
	"total_value" numeric(12, 2),
	"delivery_fee" numeric(8, 2) NOT NULL,
	"tip" numeric(8, 2) DEFAULT '0.00',
	"priority" varchar DEFAULT 'normal',
	"status" varchar DEFAULT 'pending' NOT NULL,
	"scheduled_pickup_time" timestamp,
	"scheduled_delivery_time" timestamp,
	"accepted_at" timestamp,
	"picked_up_at" timestamp,
	"delivered_at" timestamp,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"payment_status" varchar DEFAULT 'pending',
	"payment_method" varchar,
	"customer_rating" integer,
	"customer_feedback" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "delivery_personnel" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"delivery_types" jsonb NOT NULL,
	"vehicle_type" varchar NOT NULL,
	"license_number" varchar,
	"vehicle_plate_number" varchar,
	"phone_number" varchar NOT NULL,
	"emergency_contact" varchar,
	"bank_account_number" varchar,
	"routing_number" varchar,
	"preferred_areas" jsonb,
	"is_active" boolean DEFAULT true,
	"is_online" boolean DEFAULT false,
	"current_lat" numeric(10, 7),
	"current_lng" numeric(10, 7),
	"total_deliveries" integer DEFAULT 0,
	"total_earnings" numeric(12, 2) DEFAULT '0.00',
	"rating" numeric(3, 2) DEFAULT '5.00',
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_reviews" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"customer_id" varchar(36) NOT NULL,
	"delivery_personnel_id" varchar(36) NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"review_type" varchar DEFAULT 'delivery',
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_routes" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_personnel_id" varchar(36) NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"route_data" jsonb,
	"estimated_distance" numeric(8, 2),
	"estimated_duration" integer,
	"actual_distance" numeric(8, 2),
	"actual_duration" integer,
	"started_at" timestamp,
	"completed_at" timestamp,
	"tracking_points" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "demo_feature_flags" (
	"key" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"audience" varchar DEFAULT 'all' NOT NULL,
	"rollout" integer DEFAULT 0 NOT NULL,
	"meta" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "demo_orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" varchar NOT NULL,
	"seller_id" varchar,
	"total_yfx" numeric(18, 6) NOT NULL,
	"platform_fee_yfx" numeric(18, 6) NOT NULL,
	"seller_earnings_yfx" numeric(18, 6) NOT NULL,
	"items" jsonb NOT NULL,
	"delivery_address" text,
	"status" varchar DEFAULT 'created' NOT NULL,
	"driver_eta" integer,
	"is_demo_mode" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "demo_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"amount_yfx" numeric(18, 6) NOT NULL,
	"fx_kwd_to_jmd" numeric(10, 4) DEFAULT '500.0000',
	"fx_kwd_to_usd" numeric(10, 4) DEFAULT '3.2500',
	"to_user_id" varchar,
	"from_user_id" varchar,
	"order_id" varchar,
	"note" text,
	"status" varchar DEFAULT 'completed' NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "demo_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"balance_yfx" numeric(18, 6) DEFAULT '0.000000' NOT NULL,
	"is_demo_mode" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "design_suggestions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"renovation_plan_id" varchar NOT NULL,
	"current_style" varchar,
	"suggested_styles" jsonb,
	"trending_styles" jsonb,
	"current_colors" jsonb,
	"suggested_palettes" jsonb,
	"seasonal_options" jsonb,
	"current_layout" jsonb,
	"optimized_layouts" jsonb,
	"furniture_suggestions" jsonb,
	"natural_light_analysis" jsonb,
	"artificial_lighting_plan" jsonb,
	"ambient_lighting_suggestions" jsonb,
	"market_appeal_score" numeric(3, 2),
	"target_demographic" jsonb,
	"resale_value_impact" numeric(8, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents_vault" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar NOT NULL,
	"type" varchar(60) NOT NULL,
	"path" varchar(400) NOT NULL,
	"hash" varchar(128),
	"issued_by" varchar(200),
	"expires_at" timestamp,
	"verified" boolean DEFAULT false,
	"notes" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "driver_cb_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" varchar NOT NULL,
	"call_sign" varchar NOT NULL,
	"preferred_channels" jsonb,
	"current_channel_id" varchar,
	"is_online" boolean DEFAULT false,
	"last_activity" timestamp DEFAULT now(),
	"total_messages" integer DEFAULT 0,
	"reputation" numeric(5, 2) DEFAULT '5.0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "driver_cb_profiles_driver_id_unique" UNIQUE("driver_id"),
	CONSTRAINT "driver_cb_profiles_call_sign_unique" UNIQUE("call_sign")
);
--> statement-breakpoint
CREATE TABLE "driver_corporate_preferences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" varchar NOT NULL,
	"preferred_partners" jsonb,
	"excluded_partners" jsonb,
	"preferred_job_types" jsonb,
	"preferred_service_types" jsonb,
	"max_package_weight" numeric(6, 2),
	"corporate_hours_only" boolean DEFAULT false,
	"weekends_available" boolean DEFAULT true,
	"evenings_available" boolean DEFAULT true,
	"corporate_jobs_completed" integer DEFAULT 0,
	"corporate_rating" numeric(3, 2) DEFAULT '5.0',
	"preferred_by_partners" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "driver_fleets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" varchar NOT NULL,
	"fleet_type" varchar NOT NULL,
	"plate_type" varchar NOT NULL,
	"operating_zones" jsonb,
	"is_active" boolean DEFAULT true,
	"exclusive_access" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "driver_payouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" varchar NOT NULL,
	"amount_jmd" numeric(10, 2) NOT NULL,
	"method" varchar NOT NULL,
	"bank_account" varchar,
	"status" varchar DEFAULT 'pending',
	"provider_ref_id" varchar,
	"processed_at" timestamp,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_communications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" varchar NOT NULL,
	"to_user_id" varchar NOT NULL,
	"job_id" varchar,
	"application_id" varchar,
	"assignment_id" varchar,
	"subject" varchar NOT NULL,
	"body" text NOT NULL,
	"email_type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"read_at" timestamp,
	"external_email_id" varchar,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"subcategory" varchar,
	"brand" varchar,
	"model" varchar,
	"serial_number" varchar,
	"condition" varchar DEFAULT 'good' NOT NULL,
	"is_available" boolean DEFAULT true,
	"requires_training" boolean DEFAULT false,
	"safety_requirements" jsonb,
	"daily_rate" numeric(10, 2),
	"weekly_rate" numeric(10, 2),
	"monthly_rate" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'JMD',
	"security_deposit" numeric(10, 2),
	"image_urls" jsonb,
	"manual_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_checkouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"hub_id" varchar NOT NULL,
	"job_id" varchar,
	"checked_out_at" timestamp DEFAULT now(),
	"planned_return_date" date NOT NULL,
	"actual_return_date" timestamp,
	"checkout_condition" varchar NOT NULL,
	"return_condition" varchar,
	"damage_notes" text,
	"rental_rate" numeric(10, 2) NOT NULL,
	"total_cost" numeric(10, 2),
	"security_deposit" numeric(10, 2),
	"deposit_returned" boolean DEFAULT false,
	"status" varchar DEFAULT 'checked_out' NOT NULL,
	"is_overdue" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_hub_inventory" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" varchar NOT NULL,
	"hub_id" varchar NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"storage_location" varchar,
	"last_checked" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_hubs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar,
	"manager_id" varchar,
	"name" varchar NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"country" varchar DEFAULT 'JM',
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"operating_hours" jsonb,
	"is_24_hours" boolean DEFAULT false,
	"storage_capacity" integer,
	"current_occupancy" integer DEFAULT 0,
	"has_security_system" boolean DEFAULT false,
	"has_climate_control" boolean DEFAULT false,
	"phone" varchar,
	"email" varchar,
	"access_code" varchar,
	"special_instructions" text,
	"is_active" boolean DEFAULT true,
	"last_inventory_check" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "errand_groups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_name" varchar,
	"assigned_driver_id" varchar,
	"zone_id" varchar,
	"total_trip_ids" jsonb,
	"estimated_duration" integer,
	"estimated_distance" numeric(8, 2),
	"total_fare" numeric(10, 2),
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "escrow_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"type" varchar(40) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"status" varchar(20) DEFAULT 'open',
	"released_at" timestamp,
	"refunded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "expense_reminders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_id" varchar NOT NULL,
	"reminder_date" timestamp NOT NULL,
	"reminder_type" varchar NOT NULL,
	"message" text NOT NULL,
	"is_sent" boolean DEFAULT false,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fare_calculations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" varchar NOT NULL,
	"base_fare" numeric(10, 2) NOT NULL,
	"distance_cost" numeric(8, 2) DEFAULT '0.00',
	"time_cost" numeric(8, 2) DEFAULT '0.00',
	"applied_rules" jsonb,
	"rule_adjustments" numeric(8, 2) DEFAULT '0.00',
	"total_before_addons" numeric(10, 2) NOT NULL,
	"addons_cost" numeric(8, 2) DEFAULT '0.00',
	"final_fare" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD',
	"calculation_breakdown" jsonb,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fare_rules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"description" text,
	"rule_type" varchar NOT NULL,
	"value" numeric(8, 2),
	"currency" varchar(3) DEFAULT 'JMD',
	"is_enabled" boolean DEFAULT false,
	"min_applicable_amount" numeric(8, 2) DEFAULT '0.00',
	"max_applicable_amount" numeric(8, 2),
	"applicable_vehicle_types" jsonb,
	"applicable_zones" jsonb,
	"time_restrictions" jsonb,
	"priority" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "fare_rules_rule_name_unique" UNIQUE("rule_name")
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flag_name" varchar NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"rollout_percentage" integer DEFAULT 0 NOT NULL,
	"target_user_groups" jsonb,
	"safety_check" boolean DEFAULT true NOT NULL,
	"created_by" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_flag_name_unique" UNIQUE("flag_name")
);
--> statement-breakpoint
CREATE TABLE "flight_bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_booking_id" varchar NOT NULL,
	"flight_type" varchar NOT NULL,
	"departure_airport" varchar NOT NULL,
	"arrival_airport" varchar NOT NULL,
	"departure_date" date NOT NULL,
	"return_date" date,
	"passenger_count" integer DEFAULT 1 NOT NULL,
	"cabin_class" varchar DEFAULT 'economy' NOT NULL,
	"airline" varchar,
	"flight_number" varchar,
	"seat_preference" varchar,
	"meal_preference" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "freelancers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"skills" jsonb,
	"hourly_rate" numeric(8, 2),
	"balance" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"total_earnings" numeric(12, 2) DEFAULT '0.00',
	"last_payout_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_booking_id" varchar NOT NULL,
	"hotel_name" varchar NOT NULL,
	"destination" varchar NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"room_type" varchar NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"room_count" integer DEFAULT 1 NOT NULL,
	"star_rating" integer,
	"amenities" jsonb,
	"special_requests" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_roles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" varchar NOT NULL,
	"title" varchar(120) NOT NULL,
	"dept" varchar(120),
	"min_skill" varchar(40),
	"pay_rate" numeric(10, 2),
	"pay_type" varchar(20),
	"notes" varchar(500),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "hotel_shifts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" varchar NOT NULL,
	"role_id" varchar NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL,
	"slots" integer DEFAULT 1,
	"notes" varchar(500),
	"status" varchar(20) DEFAULT 'open'
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(200) NOT NULL,
	"phone" varchar(50),
	"address" varchar(300),
	"country" varchar(2) NOT NULL,
	"star_rating" integer DEFAULT 3,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "human_operators" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"whatsapp_number" varchar,
	"email" varchar NOT NULL,
	"role" varchar DEFAULT 'operator',
	"specialties" jsonb,
	"languages" jsonb DEFAULT '["English"]',
	"working_hours" jsonb,
	"is_active" boolean DEFAULT true,
	"is_online" boolean DEFAULT false,
	"current_load" integer DEFAULT 0,
	"max_load" integer DEFAULT 10,
	"rating" numeric(3, 2) DEFAULT '5.0',
	"total_conversations" integer DEFAULT 0,
	"average_response_time" integer,
	"last_active_at" timestamp DEFAULT now(),
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "immigration_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"submitted_at" timestamp DEFAULT now(),
	"decision_at" timestamp,
	"assigned_lawyer_id" varchar,
	"notes" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "immigration_programs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"country" varchar(2) NOT NULL,
	"visa_type" varchar(60) NOT NULL,
	"seasonal" boolean DEFAULT false,
	"requirements" jsonb,
	"documents_required" jsonb,
	"fee_usd" numeric(10, 2),
	"status" varchar(20) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "insurance_policies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" varchar NOT NULL,
	"insurer" varchar NOT NULL,
	"policy_number" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"coverage" text,
	"monthly_premium" numeric(10, 2),
	"is_valid" boolean DEFAULT true,
	"managed_by_yaad_flex" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"request_type" varchar NOT NULL,
	"request_data" jsonb,
	"response_data" jsonb,
	"status" varchar NOT NULL,
	"error_message" text,
	"processing_time" integer,
	"retry_count" integer DEFAULT 0,
	"corporate_job_id" varchar,
	"ip_address" varchar,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"location_id" varchar,
	"current_stock" numeric(10, 3) DEFAULT '0',
	"minimum_stock" numeric(10, 3) DEFAULT '5',
	"maximum_stock" numeric(10, 3) DEFAULT '100',
	"reorder_point" numeric(10, 3) DEFAULT '10',
	"reorder_quantity" numeric(10, 3) DEFAULT '50',
	"reserved_stock" numeric(10, 3) DEFAULT '0',
	"available_stock" numeric(10, 3) DEFAULT '0',
	"last_stock_check" timestamp,
	"stock_status" varchar DEFAULT 'in_stock',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"cover_letter" text,
	"proposed_rate" numeric(10, 2),
	"availability" varchar,
	"estimated_completion_time" integer,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"interviewed_at" timestamp,
	"hired_at" timestamp,
	"rejected_at" timestamp,
	"company_notes" text,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"supervisor_id" varchar,
	"role" varchar DEFAULT 'worker' NOT NULL,
	"assigned_rate" numeric(10, 2) NOT NULL,
	"assigned_at" timestamp DEFAULT now(),
	"start_date" date NOT NULL,
	"expected_end_date" date,
	"actual_end_date" timestamp,
	"status" varchar DEFAULT 'assigned' NOT NULL,
	"hours_worked" numeric(8, 2) DEFAULT '0.00',
	"performance_rating" numeric(3, 2),
	"company_feedback" text,
	"worker_feedback" text,
	"can_be_terminated" boolean DEFAULT true,
	"terminated_at" timestamp,
	"termination_reason" text,
	"terminated_by" varchar,
	"severance_paid" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"job_type" varchar NOT NULL,
	"skill_level" varchar DEFAULT 'entry' NOT NULL,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"start_date" date NOT NULL,
	"end_date" date,
	"is_flexible_schedule" boolean DEFAULT false,
	"working_hours" varchar,
	"pay_rate" numeric(10, 2) NOT NULL,
	"pay_type" varchar DEFAULT 'hourly' NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"estimated_duration" integer,
	"workers_needed" integer DEFAULT 1 NOT NULL,
	"supervisors_needed" integer DEFAULT 0,
	"equipment_provided" boolean DEFAULT false,
	"equipment_required" jsonb,
	"skills_required" jsonb,
	"status" varchar DEFAULT 'open' NOT NULL,
	"is_urgent" boolean DEFAULT false,
	"is_public" boolean DEFAULT true,
	"application_deadline" date,
	"total_applicants" integer DEFAULT 0,
	"hired_workers" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kyc_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"tier" varchar(20) DEFAULT 'tier1',
	"status" varchar(20) DEFAULT 'pending',
	"pep_screen" boolean DEFAULT false,
	"sanctions_hit" boolean DEFAULT false,
	"last_reviewed_at" timestamp,
	CONSTRAINT "kyc_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "learning_programs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" varchar NOT NULL,
	"apprentice_id" varchar NOT NULL,
	"skill_area" varchar NOT NULL,
	"program_level" varchar DEFAULT 'basic',
	"total_lessons" integer DEFAULT 10,
	"completed_lessons" integer DEFAULT 0,
	"practical_tasks" integer DEFAULT 5,
	"completed_tasks" integer DEFAULT 0,
	"skill_assessments" jsonb,
	"strengths" jsonb,
	"improvements" jsonb,
	"program_fee" numeric(8, 2),
	"earnings_share" numeric(5, 2) DEFAULT '60.0',
	"status" varchar DEFAULT 'active',
	"graduation_requirements" jsonb,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "learning_signals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"signal_type" varchar NOT NULL,
	"original_text" text,
	"target_lang" varchar NOT NULL,
	"translated_text" text,
	"feedback_score" integer,
	"report_reason" text,
	"context_hash" varchar,
	"session_id" varchar,
	"privacy_consent" boolean DEFAULT false NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_cases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lawyer_id" varchar NOT NULL,
	"type" varchar(60) NOT NULL,
	"status" varchar(20) DEFAULT 'open',
	"opened_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	"documents" jsonb,
	"messages_thread_id" varchar
);
--> statement-breakpoint
CREATE TABLE "legal_providers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_name" varchar(200) NOT NULL,
	"contact_email" varchar(200) NOT NULL,
	"bar_id" varchar(120),
	"country" varchar(2) NOT NULL,
	"specialties" jsonb,
	"rating" numeric(2, 1) DEFAULT '0',
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "lifestyle_addons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" varchar NOT NULL,
	"addon_type" varchar NOT NULL,
	"quantity" integer DEFAULT 1,
	"unit_price" numeric(8, 2),
	"total_charge" numeric(8, 2),
	"is_approved" boolean DEFAULT true,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "location_updates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" varchar NOT NULL,
	"trip_id" varchar,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"speed" numeric(5, 2),
	"heading" numeric(5, 2),
	"accuracy" numeric(5, 2),
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "location_zones" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"zone_type" varchar NOT NULL,
	"country" varchar DEFAULT 'Jamaica',
	"price_multiplier" numeric(4, 2) DEFAULT '1.0',
	"average_income" numeric(10, 2),
	"demand_level" varchar DEFAULT 'medium',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "logistics_partners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar NOT NULL,
	"company_code" varchar NOT NULL,
	"api_endpoint" varchar,
	"webhook_url" varchar,
	"integration_type" varchar NOT NULL,
	"auth_method" varchar,
	"is_active" boolean DEFAULT true,
	"test_mode" boolean DEFAULT true,
	"contract_type" varchar DEFAULT 'partner',
	"payment_terms" varchar DEFAULT 'net_7',
	"base_rate" numeric(8, 2),
	"volume_discounts" jsonb,
	"delivery_time_requirement" integer,
	"on_time_requirement" numeric(5, 2) DEFAULT '95.0',
	"damage_rate" numeric(5, 4) DEFAULT '0.1',
	"service_areas" jsonb,
	"service_types" jsonb,
	"max_package_weight" numeric(6, 2),
	"max_package_size" jsonb,
	"total_jobs_received" integer DEFAULT 0,
	"total_jobs_completed" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"last_job_received" timestamp,
	"contact_person" varchar,
	"contact_email" varchar,
	"contact_phone" varchar,
	"escalation_contact" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "logistics_partners_company_code_unique" UNIQUE("company_code")
);
--> statement-breakpoint
CREATE TABLE "loyalty_program" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"total_spent" numeric(12, 2) DEFAULT '0',
	"total_jobs" integer DEFAULT 0,
	"loyalty_level" varchar DEFAULT 'bronze',
	"cashback_earned" numeric(10, 2) DEFAULT '0',
	"cashback_spent" numeric(10, 2) DEFAULT '0',
	"current_cashback" numeric(10, 2) DEFAULT '0',
	"next_level_spend_required" numeric(10, 2),
	"joined_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_comps" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"make" varchar(64),
	"model" varchar(64),
	"year" integer,
	"region" varchar(64),
	"sample" jsonb,
	"median_price" numeric,
	"median_mileage" integer,
	"refreshed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_disruption" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period" varchar NOT NULL,
	"period_date" date NOT NULL,
	"traditional_agent_fees" numeric(12, 2) DEFAULT '0',
	"yardflex_fees" numeric(12, 2) DEFAULT '0',
	"customer_savings" numeric(12, 2) DEFAULT '0',
	"properties_listed" integer DEFAULT 0,
	"properties_sold" integer DEFAULT 0,
	"average_days_on_market" numeric(5, 1),
	"average_sale_price" numeric(12, 2),
	"total_virtual_tours" integer DEFAULT 0,
	"virtual_to_physical_ratio" numeric(3, 2),
	"virtual_tour_conversion_rate" numeric(3, 2),
	"traditional_agents_displaced" integer DEFAULT 0,
	"market_share_capture" numeric(5, 2) DEFAULT '0',
	"customer_satisfaction_score" numeric(3, 2) DEFAULT '5.0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "material_analysis" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ar_scan_id" varchar NOT NULL,
	"material_type" varchar NOT NULL,
	"current_material" varchar,
	"material_condition" varchar,
	"room_location" varchar,
	"specific_area" varchar,
	"coordinates" jsonb,
	"suggested_materials" jsonb,
	"upgrade_options" jsonb,
	"budget_options" jsonb,
	"current_value" numeric(8, 2),
	"replacement_cost" numeric(8, 2),
	"upgrade_value" numeric(8, 2),
	"ai_confidence" numeric(3, 2),
	"priority_score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message_translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" varchar NOT NULL,
	"target_lang" varchar NOT NULL,
	"translated_text" text NOT NULL,
	"translation_quality" numeric(5, 2) DEFAULT '0.94',
	"translation_model" varchar DEFAULT 'v-best',
	"is_human_verified" boolean DEFAULT false,
	"translation_time" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_versions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar NOT NULL,
	"status" varchar NOT NULL,
	"accuracy_score" numeric(5, 4),
	"latency_p95" integer,
	"safety_score" numeric(5, 4),
	"evaluation_passed" boolean DEFAULT false NOT NULL,
	"rollout_percentage" integer DEFAULT 0 NOT NULL,
	"deployer" varchar NOT NULL,
	"approver" varchar,
	"safety_approver" varchar,
	"deployed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "model_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "obd_readings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" varchar NOT NULL,
	"pid" varchar(24) NOT NULL,
	"value" varchar(64) NOT NULL,
	"unit" varchar(16),
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "obd_tests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" varchar,
	"vin" varchar(24),
	"started_at" timestamp DEFAULT now(),
	"finished_at" timestamp,
	"status" varchar(16) DEFAULT 'started',
	"dtc_count" integer DEFAULT 0,
	"summary" text
);
--> statement-breakpoint
CREATE TABLE "obligations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"recurrence" varchar,
	"next_due_at" timestamp NOT NULL,
	"last_paid_at" timestamp,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"autopay" boolean DEFAULT false,
	"category" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_id" varchar NOT NULL,
	"payment_method_id" varchar,
	"stripe_payment_intent_id" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"status" varchar NOT NULL,
	"payment_date" timestamp,
	"completed_at" timestamp,
	"failure_reason" text,
	"receipt_url" varchar,
	"vendor_confirmation" varchar,
	"stripe_charge_id" varchar,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_id" varchar NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"job_type" varchar NOT NULL,
	"status" varchar DEFAULT 'scheduled',
	"attempts" integer DEFAULT 0,
	"max_attempts" integer DEFAULT 3,
	"last_attempt_at" timestamp,
	"next_retry_at" timestamp,
	"error_message" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_method_configs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"method" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"provider" varchar,
	"is_active" boolean DEFAULT true,
	"min_amount_jmd" numeric(10, 2) DEFAULT '100',
	"max_amount_jmd" numeric(10, 2) DEFAULT '50000',
	"processing_time_hours" integer DEFAULT 0,
	"fees" jsonb,
	"config" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_method_configs_method_unique" UNIQUE("method")
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"stripe_payment_method_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"brand" varchar,
	"last_4" varchar,
	"expiry_month" integer,
	"expiry_year" integer,
	"bank_name" varchar,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pilot_testers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"phone" varchar,
	"region" varchar,
	"device" varchar,
	"role" varchar DEFAULT 'waitlist' NOT NULL,
	"org_code" varchar,
	"invite_token" varchar,
	"invite_expires_at" timestamp,
	"invite_used_at" timestamp,
	"consent_at" timestamp,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pilot_testers_email_unique" UNIQUE("email"),
	CONSTRAINT "pilot_testers_invite_token_unique" UNIQUE("invite_token")
);
--> statement-breakpoint
CREATE TABLE "platform_commissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"customer_id" varchar NOT NULL,
	"job_total" numeric(10, 2) NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.15',
	"commission_amount" numeric(10, 2) NOT NULL,
	"worker_earnings" numeric(10, 2) NOT NULL,
	"customer_cashback_rate" numeric(5, 4) DEFAULT '0.05',
	"customer_cashback" numeric(8, 2) NOT NULL,
	"payment_status" varchar DEFAULT 'pending',
	"processed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "platform_payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" varchar,
	"vendor_id" varchar,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"method" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"external_ref" varchar,
	"processed_at" timestamp,
	"failure_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "popular_destinations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"destination" varchar NOT NULL,
	"country" varchar NOT NULL,
	"airport_code" varchar(3),
	"image_url" varchar,
	"description" text,
	"average_price" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"season" varchar,
	"booking_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '5.00',
	"is_promoted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "precision_measurements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar,
	"measurement_type" varchar NOT NULL,
	"dimensions" jsonb NOT NULL,
	"weight" numeric(8, 3),
	"volume" numeric(10, 4),
	"surface_area" numeric(10, 4),
	"material_type" varchar,
	"difficulty" varchar DEFAULT 'standard',
	"access_conditions" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_calculations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar,
	"service_type" varchar NOT NULL,
	"measurements" jsonb,
	"base_work_cost" numeric(10, 2) NOT NULL,
	"cleanup_cost" numeric(8, 2) DEFAULT '0',
	"tool_rental_cost" numeric(8, 2) DEFAULT '0',
	"location_adjustment" numeric(8, 2) DEFAULT '0',
	"complexity_adjustment" numeric(8, 2) DEFAULT '0',
	"materials_cost" numeric(10, 2) DEFAULT '0',
	"total_before_tax" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(8, 2) DEFAULT '0',
	"final_total" numeric(10, 2) NOT NULL,
	"currency" varchar DEFAULT 'KWD',
	"breakdown" jsonb,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"supplier_id" varchar,
	"old_price" numeric(10, 2),
	"new_price" numeric(10, 2) NOT NULL,
	"price_type" varchar NOT NULL,
	"change_reason" varchar,
	"change_percentage" numeric(5, 2),
	"effective_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_rules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" varchar NOT NULL,
	"service_type" varchar NOT NULL,
	"base_rate_per_unit" numeric(10, 2) NOT NULL,
	"unit" varchar NOT NULL,
	"cleanup_rate_per_unit" numeric(8, 2) DEFAULT '0',
	"minimum_charge" numeric(8, 2),
	"location_multipliers" jsonb,
	"complexity_factors" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_zones" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone_name" varchar NOT NULL,
	"zone_type" varchar NOT NULL,
	"base_fare_multiplier" numeric(5, 2) DEFAULT '1.0',
	"allowed_plate_types" jsonb,
	"max_white_plate_drivers" integer DEFAULT 2,
	"current_white_plate_count" integer DEFAULT 0,
	"coordinates" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"parent_id" varchar,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category_id" varchar,
	"primary_supplier_id" varchar,
	"unit_of_measure" varchar DEFAULT 'each',
	"cost_price" numeric(10, 2) NOT NULL,
	"selling_price" numeric(10, 2) NOT NULL,
	"markup" numeric(5, 2),
	"barcode" varchar,
	"weight" numeric(8, 3),
	"dimensions" jsonb,
	"is_active" boolean DEFAULT true,
	"is_tracked" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_number" varchar NOT NULL,
	"owner_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"property_type" varchar NOT NULL,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"parish" varchar NOT NULL,
	"coordinates" jsonb,
	"bedrooms" integer,
	"bathrooms" numeric(3, 1),
	"square_footage" numeric(8, 2),
	"lot_size" numeric(10, 2),
	"year_built" integer,
	"asking_price" numeric(12, 2) NOT NULL,
	"price_per_sq_ft" numeric(8, 2),
	"negotiable" boolean DEFAULT true,
	"has_scan" boolean DEFAULT false,
	"scan_quality" varchar,
	"scan_date" timestamp,
	"scanner_user_id" varchar,
	"status" varchar DEFAULT 'draft',
	"listing_date" timestamp,
	"sold_date" timestamp,
	"sold_price" numeric(12, 2),
	"buyer_id" varchar,
	"yardflex_commission" numeric(8, 2) DEFAULT '2.0',
	"seller_savings" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "properties_listing_number_unique" UNIQUE("listing_number")
);
--> statement-breakpoint
CREATE TABLE "property_availability" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" varchar NOT NULL,
	"block_reason" varchar,
	"special_rate" numeric(10, 2),
	"minimum_stay" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "property_inquiries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar NOT NULL,
	"inquirer_id" varchar NOT NULL,
	"inquiry_type" varchar NOT NULL,
	"message" text,
	"offer_amount" numeric(12, 2),
	"financing" jsonb,
	"contingencies" jsonb,
	"closing_date" timestamp,
	"status" varchar DEFAULT 'pending',
	"owner_response" text,
	"response_time" integer,
	"ai_match_score" numeric(3, 2),
	"ai_recommendations" jsonb,
	"created_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "property_maintenance" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"priority" varchar DEFAULT 'medium',
	"scheduled_date" timestamp,
	"estimated_duration" integer,
	"estimated_cost" numeric(10, 2),
	"actual_cost" numeric(10, 2),
	"status" varchar DEFAULT 'pending',
	"completion_date" timestamp,
	"service_provider" varchar,
	"service_provider_contact" varchar,
	"before_photos" jsonb,
	"after_photos" jsonb,
	"receipts" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quick_tasks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poster_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"skill_level" varchar DEFAULT 'beginner',
	"address" text NOT NULL,
	"coordinates" jsonb,
	"work_location" varchar DEFAULT 'customer_location',
	"budget" numeric(8, 2) NOT NULL,
	"professional_rate" numeric(8, 2),
	"apprentice_rate" numeric(8, 2),
	"helper_rate" numeric(8, 2),
	"estimated_hours" numeric(4, 1) DEFAULT '1.0',
	"people_needed" integer DEFAULT 1,
	"tools_required" jsonb,
	"tools_provided" jsonb,
	"flexible_timing" boolean DEFAULT true,
	"urgency" varchar DEFAULT 'flexible',
	"available_hours" jsonb,
	"status" varchar DEFAULT 'open',
	"assigned_worker_id" varchar,
	"assigned_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"final_payment" numeric(8, 2),
	"customer_rating" numeric(3, 2),
	"worker_rating" numeric(3, 2),
	"customer_review" text,
	"worker_review" text,
	"teaching_opportunity" boolean DEFAULT false,
	"group_task" boolean DEFAULT false,
	"repeat_task" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rbac_audit_logs" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36),
	"action" varchar(96) NOT NULL,
	"area_code" varchar(64),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rbac_payouts" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_user_id" varchar(36) NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" varchar(8) DEFAULT 'JMD',
	"status" varchar(24) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rbac_permissions" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"label" varchar(160) NOT NULL,
	CONSTRAINT "rbac_permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "rbac_role_permissions" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" varchar(36) NOT NULL,
	"permission_code" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rbac_roles" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"label" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "rbac_roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "rbac_user_roles" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"role_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rbac_work_areas" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"label" varchar(120) NOT NULL,
	"locked_by_user_id" varchar(36),
	"lock_expires_at" timestamp,
	"is_locked" boolean DEFAULT false,
	"last_good_snapshot" jsonb,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "rbac_work_areas_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "reg_assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar NOT NULL,
	"broker_id" varchar NOT NULL,
	"status" varchar DEFAULT 'assigned',
	"pickup_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reg_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reg_payouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"broker_id" varchar NOT NULL,
	"request_id" varchar NOT NULL,
	"amount_jmd" integer NOT NULL,
	"status" varchar DEFAULT 'pending',
	"provider" varchar DEFAULT 'stripe_connect',
	"provider_payout_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reg_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar NOT NULL,
	"owner_id" varchar NOT NULL,
	"vehicle_id" varchar NOT NULL,
	"service_code" varchar NOT NULL,
	"parish" varchar NOT NULL,
	"pickup_address" text,
	"delivery_address" text,
	"notes" text,
	"quoted_fee_jmd" integer,
	"gov_fee_jmd" integer,
	"status" varchar DEFAULT 'pending_quote',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reg_sla" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar NOT NULL,
	"start_at" timestamp DEFAULT now(),
	"due_at" timestamp,
	"breached" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "reg_service_catalog" (
	"code" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"base_fee_jmd" integer NOT NULL,
	"est_gov_fee_jmd" integer DEFAULT 0,
	"sla_hours" integer DEFAULT 72,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "registration_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" varchar NOT NULL,
	"owner_id" varchar NOT NULL,
	"desired_plate_type" varchar NOT NULL,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"insurance_provider" varchar,
	"estimated_value" numeric(12, 2),
	"approved_by" varchar,
	"remarks" text,
	"submitted_at" timestamp,
	"decided_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registration_payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"provider_intent_id" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar DEFAULT 'USD' NOT NULL,
	"status" varchar DEFAULT 'pending',
	"payment_type" varchar NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registration_vehicles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar NOT NULL,
	"vin" varchar NOT NULL,
	"engine_no" varchar NOT NULL,
	"make" varchar NOT NULL,
	"model" varchar NOT NULL,
	"year" integer NOT NULL,
	"color" varchar,
	"plate_number" varchar,
	"plate_type" varchar,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "renovation_contractors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"company_name" varchar NOT NULL,
	"license_number" varchar,
	"insurance_info" jsonb,
	"bonded" boolean DEFAULT false,
	"specialties" jsonb,
	"experience_years" integer,
	"portfolio_urls" jsonb,
	"service_area" jsonb,
	"current_capacity" integer,
	"average_project_duration" integer,
	"total_projects_completed" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"on_time_percentage" numeric(5, 2) DEFAULT '100.0',
	"budget_accuracy" numeric(5, 2),
	"hourly_rate" numeric(8, 2),
	"minimum_job_size" numeric(8, 2),
	"yardflex_commission_rate" numeric(5, 4) DEFAULT '0.15',
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "renovation_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar NOT NULL,
	"planner_id" varchar NOT NULL,
	"plan_name" varchar NOT NULL,
	"description" text,
	"renovation_type" varchar NOT NULL,
	"difficulty_level" varchar DEFAULT 'medium',
	"before_scan_id" varchar,
	"after_visualization_url" varchar,
	"before_after_comparison_url" varchar,
	"estimated_cost" numeric(10, 2),
	"materials_cost" numeric(10, 2),
	"labor_cost" numeric(10, 2),
	"permits_cost" numeric(8, 2),
	"contingency_cost" numeric(8, 2),
	"estimated_duration" integer,
	"phases" jsonb,
	"current_property_value" numeric(12, 2),
	"projected_value_after" numeric(12, 2),
	"expected_roi" numeric(5, 2),
	"ai_confidence_score" numeric(3, 2),
	"ai_recommendations" jsonb,
	"alternative_plans" jsonb,
	"status" varchar DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_number" varchar NOT NULL,
	"property_id" varchar NOT NULL,
	"renter_id" varchar NOT NULL,
	"owner_id" varchar NOT NULL,
	"check_in" timestamp NOT NULL,
	"check_out" timestamp NOT NULL,
	"total_days" integer NOT NULL,
	"base_rate" numeric(10, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"security_deposit" numeric(10, 2) DEFAULT '0',
	"cleaning_fee" numeric(8, 2) DEFAULT '0',
	"service_fee" numeric(8, 2) DEFAULT '0',
	"taxes" numeric(8, 2) DEFAULT '0',
	"guest_count" integer DEFAULT 1,
	"purpose" varchar,
	"special_requests" text,
	"status" varchar DEFAULT 'pending',
	"confirmation_date" timestamp,
	"payment_status" varchar DEFAULT 'pending',
	"renter_notes" text,
	"owner_notes" text,
	"check_in_instructions" text,
	"platform_fee_amount" numeric(8, 2),
	"platform_fee_rate" numeric(5, 2) DEFAULT '15.0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rental_bookings_booking_number_unique" UNIQUE("booking_number")
);
--> statement-breakpoint
CREATE TABLE "rental_properties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"slug" varchar NOT NULL,
	"property_type" varchar NOT NULL,
	"category" varchar NOT NULL,
	"subcategory" varchar,
	"address" text NOT NULL,
	"parish" varchar NOT NULL,
	"coordinates" jsonb,
	"landmark" varchar,
	"gps_location" varchar,
	"specifications" jsonb,
	"amenities" jsonb,
	"condition" varchar DEFAULT 'excellent',
	"furnishing_status" varchar,
	"primary_image_url" varchar,
	"image_urls" jsonb,
	"video_tour_url" varchar,
	"floor_plan_url" varchar,
	"daily_rate" numeric(10, 2),
	"weekly_rate" numeric(10, 2),
	"monthly_rate" numeric(10, 2),
	"yearly_rate" numeric(10, 2),
	"currency" varchar DEFAULT 'JMD',
	"minimum_rental_period" varchar DEFAULT '1_day',
	"maximum_rental_period" varchar,
	"security_deposit" numeric(10, 2),
	"cleaning_fee" numeric(8, 2),
	"is_available" boolean DEFAULT true,
	"available_from" timestamp DEFAULT now(),
	"available_until" timestamp,
	"instant_booking" boolean DEFAULT true,
	"minimum_age" integer DEFAULT 18,
	"requires_deposit" boolean DEFAULT true,
	"requires_license" boolean DEFAULT false,
	"allows_pets" boolean DEFAULT true,
	"allows_smoking" boolean DEFAULT false,
	"max_occupancy" integer,
	"contact_phone" varchar,
	"contact_whatsapp" varchar,
	"contact_email" varchar,
	"preferred_contact_method" varchar DEFAULT 'whatsapp',
	"total_bookings" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"total_revenue" numeric(12, 2) DEFAULT '0',
	"occupancy_rate" numeric(5, 2) DEFAULT '0',
	"keywords" jsonb,
	"tags" jsonb,
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"verification_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rental_properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rental_reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" varchar NOT NULL,
	"property_id" varchar NOT NULL,
	"reviewer_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar,
	"content" text NOT NULL,
	"photos" jsonb,
	"cleanliness_rating" integer,
	"accuracy_rating" integer,
	"communication_rating" integer,
	"location_rating" integer,
	"value_rating" integer,
	"review_type" varchar DEFAULT 'renter',
	"is_verified" boolean DEFAULT true,
	"is_public" boolean DEFAULT true,
	"owner_response" text,
	"owner_response_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reorder_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"supplier_id" varchar NOT NULL,
	"requested_quantity" numeric(10, 3) NOT NULL,
	"estimated_cost" numeric(10, 2),
	"priority" varchar DEFAULT 'normal',
	"status" varchar DEFAULT 'pending',
	"auto_generated" boolean DEFAULT false,
	"expected_delivery" timestamp,
	"approved_by" varchar,
	"approved_at" timestamp,
	"order_number" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_renovations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"renovation_plan_id" varchar NOT NULL,
	"room_name" varchar NOT NULL,
	"room_type" varchar NOT NULL,
	"current_dimensions" jsonb,
	"proposed_dimensions" jsonb,
	"walls_to_remove" jsonb,
	"walls_to_add" jsonb,
	"window_changes" jsonb,
	"door_changes" jsonb,
	"ceiling_changes" jsonb,
	"flooring_plan" jsonb,
	"wall_finishes" jsonb,
	"ceiling_finishes" jsonb,
	"lighting_plan" jsonb,
	"kitchen_upgrades" jsonb,
	"bathroom_upgrades" jsonb,
	"built_in_features" jsonb,
	"room_cost" numeric(10, 2),
	"room_duration" integer,
	"priority" integer DEFAULT 1,
	"before_image_urls" jsonb,
	"after_visualization_urls" jsonb,
	"progress_image_urls" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sales_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar,
	"category_id" varchar,
	"period" varchar NOT NULL,
	"period_date" date NOT NULL,
	"units_sold" numeric(10, 3) DEFAULT '0',
	"total_revenue" numeric(10, 2) DEFAULT '0',
	"total_cost" numeric(10, 2) DEFAULT '0',
	"total_profit" numeric(10, 2) DEFAULT '0',
	"profit_margin" numeric(5, 2) DEFAULT '0',
	"average_order_value" numeric(10, 2),
	"top_customer" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "secure_browser_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_token" varchar NOT NULL,
	"user_agent" text,
	"ip_address" varchar,
	"vpn_enabled" boolean DEFAULT true,
	"ad_block_enabled" boolean DEFAULT true,
	"tracking_protection" boolean DEFAULT true,
	"https_only" boolean DEFAULT true,
	"visited_sites" jsonb,
	"blocked_sites" jsonb,
	"security_warnings" jsonb,
	"is_active" boolean DEFAULT true,
	"last_activity" timestamp DEFAULT now(),
	"session_duration" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "secure_browser_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" varchar,
	"vehicle_id" varchar,
	"user_id" varchar,
	"event_type" varchar NOT NULL,
	"threat_level" varchar NOT NULL,
	"ai_confidence" numeric(5, 2),
	"description" text NOT NULL,
	"action_taken" text,
	"is_resolved" boolean DEFAULT false,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "security_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"event_type" varchar NOT NULL,
	"severity" varchar DEFAULT 'low' NOT NULL,
	"description" text NOT NULL,
	"ip_address" varchar,
	"user_agent" text,
	"threat_blocked" boolean DEFAULT false,
	"defense_system_activated" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon_name" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"business_name" varchar,
	"description" text,
	"skills" text[],
	"service_areas" text[],
	"hourly_rate" numeric(10, 2),
	"minimum_job" numeric(10, 2),
	"availability" jsonb,
	"is_verified" boolean DEFAULT false,
	"has_insurance" boolean DEFAULT false,
	"license_number" varchar,
	"rating" numeric(3, 2) DEFAULT '5.00',
	"total_jobs" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_quotes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar DEFAULT 'KWD',
	"description" text,
	"estimated_duration" varchar,
	"start_date" timestamp,
	"materials" jsonb,
	"is_accepted" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"category_id" varchar NOT NULL,
	"provider_id" varchar,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"urgency" varchar DEFAULT 'normal' NOT NULL,
	"estimated_hours" numeric(5, 2),
	"budget_range" varchar,
	"preferred_date" timestamp,
	"images" text[],
	"status" varchar DEFAULT 'open' NOT NULL,
	"total_amount" numeric(10, 2),
	"currency" varchar DEFAULT 'KWD',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar NOT NULL,
	"reviewer_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"work_quality" integer,
	"communication" integer,
	"punctuality" integer,
	"cleanliness" integer,
	"would_recommend" boolean DEFAULT true,
	"images" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipment_tracking" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" varchar NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"accuracy" numeric(5, 2),
	"altitude" numeric(6, 2),
	"speed" numeric(5, 2),
	"heading" numeric(5, 2),
	"driver_notes" text,
	"photo_url" varchar,
	"battery_level" integer,
	"signal_strength" integer,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_number" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"recipient_id" varchar,
	"shipping_partner_id" varchar,
	"pickup_address" text NOT NULL,
	"pickup_coordinates" jsonb,
	"pickup_contact_name" varchar NOT NULL,
	"pickup_contact_phone" varchar NOT NULL,
	"pickup_date" timestamp,
	"pickup_time_slot" varchar,
	"delivery_address" text NOT NULL,
	"delivery_coordinates" jsonb,
	"recipient_name" varchar NOT NULL,
	"recipient_phone" varchar NOT NULL,
	"delivery_date" timestamp,
	"delivery_time_slot" varchar,
	"delivery_instructions" text,
	"package_description" text NOT NULL,
	"package_weight" numeric(8, 3) NOT NULL,
	"package_dimensions" jsonb,
	"package_value" numeric(10, 2),
	"is_fragile" boolean DEFAULT false,
	"requires_signature" boolean DEFAULT false,
	"service_type" varchar DEFAULT 'standard',
	"priority" varchar DEFAULT 'normal',
	"shipping_cost" numeric(10, 2) NOT NULL,
	"insurance_cost" numeric(8, 2) DEFAULT '0',
	"total_cost" numeric(10, 2) NOT NULL,
	"status" varchar DEFAULT 'pending',
	"current_location" text,
	"estimated_delivery_time" timestamp,
	"actual_pickup_time" timestamp,
	"actual_delivery_time" timestamp,
	"ai_communication_enabled" boolean DEFAULT true,
	"last_ai_update" timestamp,
	"ai_summary" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "shipments_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "shipping_partners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"contact_person" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"whatsapp_number" varchar,
	"email" varchar,
	"preferred_contact_method" varchar DEFAULT 'phone',
	"service_area" jsonb,
	"vehicle_types" jsonb,
	"base_rate_per_km" numeric(8, 2),
	"express_rate_per_km" numeric(8, 2),
	"max_weight_capacity" numeric(8, 2),
	"max_volume_capacity" numeric(8, 3),
	"rating" numeric(3, 2) DEFAULT '5.0',
	"total_deliveries" integer DEFAULT 0,
	"on_time_percentage" numeric(5, 2) DEFAULT '100.0',
	"is_active" boolean DEFAULT true,
	"available_hours" jsonb,
	"special_services" jsonb,
	"notes" text,
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"hashtags" jsonb,
	"image_urls" jsonb,
	"video_url" varchar,
	"scheduled_for" timestamp,
	"post_type" varchar DEFAULT 'community',
	"is_auto_generated" boolean DEFAULT false,
	"template_used" varchar,
	"ai_generated" boolean DEFAULT false,
	"total_reach" integer DEFAULT 0,
	"total_engagement" integer DEFAULT 0,
	"click_throughs" integer DEFAULT 0,
	"bookings_generated" integer DEFAULT 0,
	"status" varchar DEFAULT 'draft',
	"published_at" timestamp,
	"error_message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"template_type" varchar NOT NULL,
	"title_template" text,
	"content_template" text NOT NULL,
	"hashtag_template" text,
	"background_color" varchar DEFAULT '#000000',
	"text_color" varchar DEFAULT '#FFFFFF',
	"accent_color" varchar DEFAULT '#FFD700',
	"font_style" varchar DEFAULT 'bold',
	"variables" jsonb,
	"examples" jsonb,
	"usage_count" integer DEFAULT 0,
	"avg_engagement_rate" numeric(5, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"alert_type" varchar NOT NULL,
	"alert_level" varchar DEFAULT 'warning',
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"is_resolved" boolean DEFAULT false,
	"triggered_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"resolved_by" varchar
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"movement_type" varchar NOT NULL,
	"quantity" numeric(10, 3) NOT NULL,
	"unit_cost" numeric(10, 2),
	"total_value" numeric(10, 2),
	"reference_number" varchar,
	"supplier_id" varchar,
	"user_id" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "structural_analysis" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ar_scan_id" varchar NOT NULL,
	"load_bearing_walls" jsonb,
	"removable_walls" jsonb,
	"wall_condition" jsonb,
	"foundation_visible" boolean DEFAULT false,
	"foundation_condition" varchar,
	"support_beams" jsonb,
	"safety_issues" jsonb,
	"permits_required" jsonb,
	"professional_required" jsonb,
	"wall_removal_possible" jsonb,
	"addition_possible" jsonb,
	"second_floor_possible" boolean DEFAULT false,
	"building_code_issues" jsonb,
	"zone_restrictions" jsonb,
	"hoa_restrictions" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subsystems" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supervisors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"worker_id" varchar,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"management_experience" integer DEFAULT 0,
	"max_team_size" integer DEFAULT 5,
	"industries" jsonb,
	"city" varchar NOT NULL,
	"country" varchar DEFAULT 'JM',
	"max_travel_distance" integer DEFAULT 50,
	"supervisory_rate" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'JMD',
	"rating" numeric(3, 2) DEFAULT '5.00',
	"total_projects_supervised" integer DEFAULT 0,
	"is_available" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"can_hire_workers" boolean DEFAULT false,
	"can_fire_workers" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "supervisors_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"contact_person" varchar,
	"phone" varchar,
	"email" varchar,
	"address" text,
	"country" varchar DEFAULT 'Jamaica',
	"reliability" numeric(3, 2) DEFAULT '5.0',
	"average_delivery_time" integer,
	"payment_terms" varchar DEFAULT 'net_30',
	"is_active" boolean DEFAULT true,
	"total_orders" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_diagnostics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component" varchar NOT NULL,
	"health" varchar NOT NULL,
	"error_rate" numeric(5, 4),
	"latency_p95" integer,
	"throughput" integer,
	"memory_usage" numeric(5, 2),
	"cpu_usage" numeric(5, 2),
	"alert_triggered" boolean DEFAULT false NOT NULL,
	"auto_repair_attempted" boolean DEFAULT false NOT NULL,
	"repair_successful" boolean,
	"check_timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_errors" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"subsystem_id" varchar(36),
	"error_type" varchar(32) NOT NULL,
	"component" varchar(128) NOT NULL,
	"message" text NOT NULL,
	"location" text,
	"stack_trace" text,
	"metadata" jsonb,
	"count" integer DEFAULT 1,
	"is_resolved" boolean DEFAULT false,
	"first_occurred" timestamp DEFAULT now(),
	"last_occurred" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "system_health_checks" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"subsystem_id" varchar(36),
	"status" varchar(16) NOT NULL,
	"response_time" integer,
	"uptime" varchar(16),
	"details" text,
	"checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_health_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_type" varchar NOT NULL,
	"metric_name" varchar NOT NULL,
	"value" numeric(15, 4) NOT NULL,
	"unit" varchar,
	"threshold" numeric(15, 4),
	"is_healthy" boolean DEFAULT true,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"proposed_rate" numeric(8, 2) NOT NULL,
	"proposed_hours" numeric(4, 1),
	"proposed_start_time" timestamp,
	"message" text,
	"experience" text,
	"approach" text,
	"status" varchar DEFAULT 'pending',
	"response_message" text,
	"created_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "task_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"parent_category" varchar,
	"typical_helper_rate" numeric(6, 2),
	"typical_apprentice_rate" numeric(6, 2),
	"typical_professional_rate" numeric(6, 2),
	"min_hours" numeric(3, 1) DEFAULT '0.5',
	"max_hours" numeric(3, 1) DEFAULT '8.0',
	"average_hours" numeric(3, 1) DEFAULT '2.0',
	"common_tools" jsonb,
	"skills_required" jsonb,
	"safety_requirements" jsonb,
	"total_tasks" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" varchar NOT NULL,
	"customer_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"agreed_amount" numeric(8, 2) NOT NULL,
	"platform_fee" numeric(6, 2),
	"worker_earnings" numeric(8, 2),
	"status" varchar DEFAULT 'pending',
	"payment_method" varchar DEFAULT 'kwd_wallet',
	"paid_at" timestamp,
	"dispute_reason" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_workers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"worker_level" varchar DEFAULT 'helper',
	"experience_years" numeric(3, 1) DEFAULT '0.0',
	"skill_categories" jsonb,
	"tools_owned" jsonb,
	"transportation" varchar,
	"max_travel_distance" numeric(4, 1) DEFAULT '5.0',
	"available_hours" jsonb,
	"min_job_size" numeric(6, 2) DEFAULT '15.00',
	"preferred_job_size" varchar DEFAULT 'small',
	"tasks_completed" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"success_rate" numeric(5, 2) DEFAULT '100.0',
	"response_time" numeric(4, 1),
	"total_earned" numeric(10, 2) DEFAULT '0',
	"weekly_goal" numeric(8, 2),
	"daily_goal" numeric(6, 2),
	"learning_mode" boolean DEFAULT false,
	"teaching_mode" boolean DEFAULT false,
	"skills_learning" jsonb,
	"mentor_id" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "timeless_core_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar NOT NULL,
	"safety_mode" varchar DEFAULT 'strict' NOT NULL,
	"learning_rate_limit" integer DEFAULT 100 NOT NULL,
	"human_approval_required" boolean DEFAULT true NOT NULL,
	"privacy_mode" varchar DEFAULT 'maximum' NOT NULL,
	"drift_threshold" numeric(3, 2) DEFAULT '0.20' NOT NULL,
	"rollback_enabled" boolean DEFAULT true NOT NULL,
	"last_known_good_version" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_equipment" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"description" text,
	"condition" varchar DEFAULT 'good',
	"daily_rate" numeric(8, 2),
	"currency" varchar DEFAULT 'KWD',
	"location" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"images" text[],
	"availability" jsonb,
	"is_available" boolean DEFAULT true,
	"requires_deposit" boolean DEFAULT false,
	"deposit_amount" numeric(8, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tool_rental_rates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tool_name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"daily_rate" numeric(8, 2) NOT NULL,
	"weekly_rate" numeric(8, 2),
	"deposit_required" numeric(8, 2),
	"service_types" text[],
	"availability" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"recipient_id" varchar,
	"recipient_phone" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"description" text,
	"security_level" varchar DEFAULT 'standard' NOT NULL,
	"country_code" varchar(2),
	"is_secure_transfer" boolean DEFAULT true,
	"exchange_rate" numeric(10, 4) DEFAULT '1.0000',
	"original_currency" varchar(3),
	"original_amount" numeric(12, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "translation_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" varchar NOT NULL,
	"translation_id" varchar NOT NULL,
	"reporter_id" varchar NOT NULL,
	"issue_type" varchar NOT NULL,
	"original_text" text NOT NULL,
	"incorrect_translation" text NOT NULL,
	"suggested_translation" text,
	"report_description" text,
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"booking_type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"commission" numeric(12, 2) NOT NULL,
	"booking_reference" varchar NOT NULL,
	"customer_name" varchar NOT NULL,
	"customer_email" varchar NOT NULL,
	"customer_phone" varchar NOT NULL,
	"special_requests" text,
	"booking_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_commissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_booking_id" varchar NOT NULL,
	"agent_id" varchar,
	"commission_rate" numeric(5, 2) DEFAULT '8.00' NOT NULL,
	"commission_amount" numeric(12, 2) NOT NULL,
	"booking_amount" numeric(12, 2) NOT NULL,
	"payout_status" varchar DEFAULT 'pending',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_itineraries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"pnr" varchar(12),
	"segments" jsonb,
	"price" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"status" varchar(20) DEFAULT 'hold',
	"provider" varchar(60),
	"ticketed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "travel_packages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_name" varchar NOT NULL,
	"destination" varchar NOT NULL,
	"duration" integer NOT NULL,
	"package_type" varchar NOT NULL,
	"base_price" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"max_capacity" integer NOT NULL,
	"current_bookings" integer DEFAULT 0,
	"includes" jsonb,
	"excludes" jsonb,
	"highlights" jsonb,
	"is_active" boolean DEFAULT true,
	"valid_from" date NOT NULL,
	"valid_to" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trip_assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" varchar NOT NULL,
	"assigned_driver_id" varchar,
	"zone_id" varchar,
	"assignment_method" varchar DEFAULT 'automatic',
	"algorithm_score" numeric(8, 4),
	"distance_to_pickup" numeric(8, 2),
	"driver_workload_score" numeric(5, 2),
	"priority_level" integer DEFAULT 1,
	"status" varchar DEFAULT 'pending',
	"assigned_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rider_id" varchar NOT NULL,
	"driver_id" varchar,
	"vehicle_id" varchar,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'requested' NOT NULL,
	"pickup_latitude" numeric(10, 8) NOT NULL,
	"pickup_longitude" numeric(11, 8) NOT NULL,
	"pickup_address" text,
	"dropoff_latitude" numeric(10, 8),
	"dropoff_longitude" numeric(11, 8),
	"dropoff_address" text,
	"estimated_fare" numeric(10, 2),
	"actual_fare" numeric(10, 2),
	"distance" numeric(8, 2),
	"duration" integer,
	"is_publicly_visible" boolean DEFAULT true,
	"security_level" varchar DEFAULT 'enhanced' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trusted_websites" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"verification_level" varchar DEFAULT 'verified',
	"security_rating" varchar DEFAULT 'A+',
	"last_security_check" timestamp DEFAULT now(),
	"logo_url" varchar,
	"primary_color" varchar,
	"description" text,
	"total_visits" integer DEFAULT 0,
	"unique_users" integer DEFAULT 0,
	"average_session_time" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"added_by" varchar,
	"approval_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trusted_websites_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "user_devices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"device_id" varchar NOT NULL,
	"device_type" varchar NOT NULL,
	"platform" varchar,
	"device_name" varchar,
	"is_trusted" boolean DEFAULT false,
	"can_access_financials" boolean DEFAULT false,
	"biometric_enabled" boolean DEFAULT false,
	"last_used" timestamp DEFAULT now(),
	"security_token" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_mfa" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"totp_secret" text,
	"enabled" boolean DEFAULT false,
	"recovery_codes_hash" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"device_id" varchar(64),
	"ip" varchar(64),
	"user_agent" text,
	"started_at" timestamp DEFAULT now(),
	"last_seen_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"currency" varchar(3) NOT NULL,
	"balance" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_transaction_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"mfa_enabled" boolean DEFAULT false,
	"mfa_secret" varchar,
	"backup_codes" jsonb,
	"security_level" varchar DEFAULT 'standard' NOT NULL,
	"last_security_check" timestamp,
	"trusted_devices" jsonb,
	"preferred_lang" varchar DEFAULT 'en-JM',
	"fallback_lang" varchar DEFAULT 'en-US',
	"show_always_english_toggle" boolean DEFAULT true,
	"caption_voice_messages" boolean DEFAULT true,
	"auto_translate_enabled" boolean DEFAULT true,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"privacy_accepted" boolean DEFAULT false NOT NULL,
	"user_agreement_accepted" boolean DEFAULT false NOT NULL,
	"driver_agreement_accepted" boolean DEFAULT false,
	"business_agreement_accepted" boolean DEFAULT false,
	"legal_accepted_at" timestamp,
	"terms_version" varchar DEFAULT '1.0',
	"privacy_version" varchar DEFAULT '1.0',
	"agreement_version" varchar DEFAULT '1.0',
	"ip_address_at_acceptance" varchar,
	"user_agent_at_acceptance" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "valuations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" varchar,
	"vin" varchar(24),
	"make" varchar(64),
	"model" varchar(64),
	"year" integer,
	"mileage" integer,
	"region" varchar(64),
	"condition_score" integer,
	"obd_health_score" integer,
	"estimate_low" numeric,
	"estimate_mid" numeric,
	"estimate_high" numeric,
	"inputs" jsonb,
	"currency" varchar(3) DEFAULT 'USD',
	"method" varchar(32) DEFAULT 'hedonic_v1',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"title" varchar,
	"url" text NOT NULL,
	"verified" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicle_inspections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" varchar NOT NULL,
	"inspector_name" varchar,
	"station" varchar,
	"passed" boolean DEFAULT false,
	"report_url" text,
	"condition_score" integer,
	"evaluator_id" varchar,
	"evaluator_notes" text,
	"photos" jsonb,
	"inspected_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicle_listings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" varchar NOT NULL,
	"company_id" varchar,
	"make" varchar NOT NULL,
	"model" varchar NOT NULL,
	"year" integer NOT NULL,
	"mileage" integer,
	"vin" varchar,
	"license_plate" varchar,
	"body_type" varchar,
	"transmission" varchar,
	"fuel_type" varchar,
	"engine_size" varchar,
	"color" varchar,
	"price" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD',
	"is_negotiable" boolean DEFAULT true,
	"financing_available" boolean DEFAULT false,
	"trade_in_accepted" boolean DEFAULT false,
	"condition" varchar NOT NULL,
	"accident_history" boolean DEFAULT false,
	"service_history" jsonb,
	"city" varchar NOT NULL,
	"country" varchar DEFAULT 'JM',
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"image_urls" jsonb,
	"video_url" varchar,
	"documents_urls" jsonb,
	"status" varchar DEFAULT 'active' NOT NULL,
	"is_promoted" boolean DEFAULT false,
	"promotion_expires_at" timestamp,
	"view_count" integer DEFAULT 0,
	"inquiry_count" integer DEFAULT 0,
	"favorite_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicle_owners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"trn" varchar,
	"address" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" varchar NOT NULL,
	"vehicle_type" varchar NOT NULL,
	"license_plate" varchar NOT NULL,
	"model" varchar,
	"color" varchar,
	"is_active" boolean DEFAULT true,
	"current_latitude" numeric(10, 8),
	"current_longitude" numeric(11, 8),
	"last_location_update" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"contact_email" varchar NOT NULL,
	"billing_email" varchar,
	"support_email" varchar,
	"account_number" varchar,
	"customer_number" varchar,
	"payment_terms" varchar DEFAULT 'due_on_receipt',
	"preferred_payment_method" varchar DEFAULT 'card',
	"website" varchar,
	"phone" varchar,
	"address" text,
	"tax_id" varchar,
	"notes" text,
	"auto_pay_enabled" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"contact_email" varchar,
	"contact_phone" varchar,
	"website" varchar,
	"account_number" varchar,
	"payment_method" varchar,
	"payment_details" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vin_decodes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vin" varchar(24) NOT NULL,
	"make" varchar(64),
	"model" varchar(64),
	"year" integer,
	"body" varchar(64),
	"engine" varchar(64),
	"trim" varchar(64),
	"raw" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "virtual_tours" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar NOT NULL,
	"viewer_id" varchar,
	"tour_type" varchar NOT NULL,
	"device_info" jsonb,
	"session_duration" integer,
	"rooms_visited" jsonb,
	"measurements_taken" jsonb,
	"photos_captured" jsonb,
	"notes_added" jsonb,
	"viewing_time" integer,
	"return_visits" integer DEFAULT 1,
	"shared_with" jsonb,
	"inquiry_generated" boolean DEFAULT false,
	"viewer_location" jsonb,
	"real_visit_scheduled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"reference_id" varchar,
	"reference_type" varchar,
	"description" text,
	"metadata" jsonb,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wholesale_orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar NOT NULL,
	"buyer_id" varchar NOT NULL,
	"supplier_id" varchar NOT NULL,
	"order_items" jsonb NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"shipping_cost" numeric(8, 2) DEFAULT '0',
	"total_amount" numeric(12, 2) NOT NULL,
	"payment_terms" varchar NOT NULL,
	"delivery_terms" varchar DEFAULT 'fob_supplier',
	"expected_delivery" timestamp,
	"status" varchar DEFAULT 'pending',
	"confirmation_date" timestamp,
	"production_start_date" timestamp,
	"shipped_date" timestamp,
	"delivered_date" timestamp,
	"buyer_notes" text,
	"supplier_notes" text,
	"internal_notes" text,
	"payment_status" varchar DEFAULT 'pending',
	"payment_due_date" timestamp,
	"paid_amount" numeric(12, 2) DEFAULT '0',
	"paid_date" timestamp,
	"platform_fee" numeric(10, 2),
	"platform_fee_paid" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "wholesale_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "wholesale_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" varchar NOT NULL,
	"product_name" varchar NOT NULL,
	"product_code" varchar,
	"category" varchar NOT NULL,
	"subcategory" varchar,
	"description" text NOT NULL,
	"specifications" jsonb,
	"materials" jsonb,
	"finish_options" jsonb,
	"unit_wholesale_price" numeric(10, 2) NOT NULL,
	"bulk_pricing" jsonb,
	"minimum_order_qty" integer DEFAULT 1,
	"lead_time" integer DEFAULT 7,
	"shelf_life" integer,
	"warranty" varchar,
	"current_stock" integer DEFAULT 0,
	"production_capacity" integer,
	"is_customizable" boolean DEFAULT false,
	"customization_options" jsonb,
	"visible_to" jsonb,
	"required_business_types" jsonb,
	"image_urls" jsonb,
	"catalog_pdf_url" varchar,
	"video_url" varchar,
	"total_orders" integer DEFAULT 0,
	"average_rating" numeric(3, 2) DEFAULT '5.0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "wholesale_products_product_code_unique" UNIQUE("product_code")
);
--> statement-breakpoint
CREATE TABLE "work_schedules" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"day_of_week" varchar(16) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"date_of_birth" date,
	"address" text,
	"city" varchar NOT NULL,
	"country" varchar DEFAULT 'JM',
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"max_travel_distance" integer DEFAULT 25,
	"skills" jsonb,
	"experience_level" varchar DEFAULT 'entry' NOT NULL,
	"years_experience" integer DEFAULT 0,
	"specializations" jsonb,
	"preferred_job_types" jsonb,
	"available_days" jsonb,
	"preferred_hours" varchar,
	"hourly_rate" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'JMD',
	"is_available" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"background_check_passed" boolean DEFAULT false,
	"rating" numeric(3, 2) DEFAULT '5.00',
	"total_jobs_completed" integer DEFAULT 0,
	"profile_image_url" varchar,
	"resume_url" varchar,
	"certifications" jsonb,
	"references" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "workers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "yaadflex_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"description" text,
	"category_type" varchar NOT NULL,
	"icon_url" varchar,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yaadflex_order_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"product_name" varchar NOT NULL,
	"product_sku" varchar NOT NULL,
	"product_image" varchar,
	"selected_size" varchar,
	"selected_color" varchar,
	"customization" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"item_status" varchar DEFAULT 'pending',
	"supplier_status" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yaadflex_orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"order_number" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(8, 2) DEFAULT '0.00',
	"tax_amount" numeric(8, 2) DEFAULT '0.00',
	"discount_amount" numeric(8, 2) DEFAULT '0.00',
	"total_amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"shipping_address" jsonb,
	"billing_address" jsonb,
	"shipping_method" varchar DEFAULT 'standard',
	"tracking_number" varchar,
	"tracking_url" varchar,
	"supplier_id" varchar,
	"supplier_order_id" varchar,
	"order_date" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"estimated_delivery" timestamp,
	"customer_notes" text,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "yaadflex_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "yaadflex_pay_cards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"card_type" varchar NOT NULL,
	"card_brand" varchar NOT NULL,
	"masked_number" varchar NOT NULL,
	"stripe_card_id" varchar,
	"is_active" boolean DEFAULT true,
	"is_blocked" boolean DEFAULT false,
	"expiry_month" integer NOT NULL,
	"expiry_year" integer NOT NULL,
	"spending_limit" numeric(10, 2) DEFAULT '50000.00',
	"total_spent" numeric(12, 2) DEFAULT '0.00',
	"last_used" timestamp,
	"issued_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yaadflex_pay_merchants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_code" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"contact_phone" varchar NOT NULL,
	"contact_email" varchar,
	"business_type" varchar NOT NULL,
	"address" text,
	"is_active" boolean DEFAULT true,
	"fee_percentage" numeric(5, 2) DEFAULT '1.50',
	"daily_limit" numeric(12, 2) DEFAULT '1000000.00',
	"total_transactions" integer DEFAULT 0,
	"total_volume" numeric(14, 2) DEFAULT '0.00',
	"last_transaction_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "yaadflex_pay_merchants_merchant_code_unique" UNIQUE("merchant_code")
);
--> statement-breakpoint
CREATE TABLE "yaadflex_pay_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"from_user_id" varchar NOT NULL,
	"to_user_id" varchar,
	"merchant_code" varchar,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'JMD' NOT NULL,
	"fee" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"description" text NOT NULL,
	"reference" varchar,
	"bank_transaction_id" varchar,
	"failure_reason" text,
	"ip_address" varchar,
	"device_id" varchar,
	"location" varchar,
	"is_reversible" boolean DEFAULT true,
	"reversed_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "yaadflex_pay_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "yaadflex_pay_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar NOT NULL,
	"pin" varchar NOT NULL,
	"pin_salt" varchar NOT NULL,
	"preferred_bank" varchar NOT NULL,
	"bank_account" varchar,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"kyc_status" varchar DEFAULT 'pending',
	"security_level" varchar DEFAULT 'standard',
	"daily_limit" numeric(10, 2) DEFAULT '100000.00',
	"monthly_limit" numeric(10, 2) DEFAULT '500000.00',
	"failed_pin_attempts" integer DEFAULT 0,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "yaadflex_pay_users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "yaadflex_pay_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"currency" varchar(3) NOT NULL,
	"balance" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"pending_balance" numeric(12, 2) DEFAULT '0.00',
	"total_deposited" numeric(12, 2) DEFAULT '0.00',
	"total_withdrawn" numeric(12, 2) DEFAULT '0.00',
	"total_sent" numeric(12, 2) DEFAULT '0.00',
	"total_received" numeric(12, 2) DEFAULT '0.00',
	"last_transaction_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yaadflex_product_reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"customer_id" varchar NOT NULL,
	"order_id" varchar,
	"rating" integer NOT NULL,
	"title" varchar,
	"review_text" text,
	"pros" text,
	"cons" text,
	"is_verified_purchase" boolean DEFAULT false,
	"is_visible" boolean DEFAULT true,
	"is_moderated" boolean DEFAULT false,
	"review_images" jsonb,
	"review_video" varchar,
	"helpful_votes" integer DEFAULT 0,
	"unhelpful_votes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yaadflex_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"short_description" varchar,
	"base_price" numeric(10, 2) NOT NULL,
	"sale_price" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"cost_price" numeric(10, 2),
	"sku" varchar NOT NULL,
	"brand" varchar DEFAULT 'YaadFlex',
	"sizes" jsonb,
	"colors" jsonb,
	"materials" jsonb,
	"images" jsonb,
	"primary_image_url" varchar,
	"video_url" varchar,
	"supplier_id" varchar,
	"supplier_product_id" varchar,
	"shipping_weight" numeric(6, 2),
	"shipping_dimensions" jsonb,
	"processing_days" integer DEFAULT 3,
	"estimated_shipping_days" integer DEFAULT 7,
	"status" varchar DEFAULT 'active',
	"stock_quantity" integer DEFAULT 0,
	"low_stock_threshold" integer DEFAULT 10,
	"is_drop_shipped" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"is_luxury" boolean DEFAULT true,
	"seo_title" varchar,
	"seo_description" text,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "yaadflex_products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "yaadflex_suppliers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"contact_email" varchar NOT NULL,
	"contact_phone" varchar,
	"website" varchar,
	"address" text,
	"country" varchar,
	"api_endpoint" varchar,
	"api_key" varchar,
	"minimum_order" numeric(10, 2) DEFAULT '0.00',
	"shipping_cost" numeric(8, 2) DEFAULT '0.00',
	"free_shipping_threshold" numeric(10, 2),
	"payment_terms" varchar DEFAULT 'prepaid',
	"reliability" numeric(3, 2) DEFAULT '5.00',
	"average_processing_time" integer DEFAULT 3,
	"quality_rating" numeric(3, 2) DEFAULT '5.00',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "adaptive_learning_metrics" ADD CONSTRAINT "adaptive_learning_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "age_verifications" ADD CONSTRAINT "age_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_logs" ADD CONSTRAINT "agent_logs_task_id_autonomous_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."autonomous_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_task_id_autonomous_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."autonomous_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ar_scanners" ADD CONSTRAINT "ar_scanners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ar_scans" ADD CONSTRAINT "ar_scans_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ar_scans" ADD CONSTRAINT "ar_scans_scanner_user_id_users_id_fk" FOREIGN KEY ("scanner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authentication_logs" ADD CONSTRAINT "authentication_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authentication_logs" ADD CONSTRAINT "authentication_logs_device_id_user_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."user_devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autonomous_tasks" ADD CONSTRAINT "autonomous_tasks_obligation_id_obligations_id_fk" FOREIGN KEY ("obligation_id") REFERENCES "public"."obligations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_alerts" ADD CONSTRAINT "availability_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_regions" ADD CONSTRAINT "broker_regions_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_bookmarks" ADD CONSTRAINT "browser_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_security_events" ADD CONSTRAINT "browser_security_events_session_id_secure_browser_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."secure_browser_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_security_events" ADD CONSTRAINT "browser_security_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_accounts" ADD CONSTRAINT "business_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_verifications" ADD CONSTRAINT "business_verifications_business_account_id_business_accounts_id_fk" FOREIGN KEY ("business_account_id") REFERENCES "public"."business_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_rental_bookings" ADD CONSTRAINT "car_rental_bookings_travel_booking_id_travel_bookings_id_fk" FOREIGN KEY ("travel_booking_id") REFERENCES "public"."travel_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cashback_transactions" ADD CONSTRAINT "cashback_transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cashback_transactions" ADD CONSTRAINT "cashback_transactions_related_job_id_service_requests_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cb_channel_subscriptions" ADD CONSTRAINT "cb_channel_subscriptions_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cb_channel_subscriptions" ADD CONSTRAINT "cb_channel_subscriptions_channel_id_cb_radio_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."cb_radio_channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cb_radio_messages" ADD CONSTRAINT "cb_radio_messages_channel_id_cb_radio_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."cb_radio_channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cb_radio_messages" ADD CONSTRAINT "cb_radio_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corporate_jobs" ADD CONSTRAINT "corporate_jobs_partner_id_logistics_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."logistics_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corporate_jobs" ADD CONSTRAINT "corporate_jobs_assigned_driver_id_users_id_fk" FOREIGN KEY ("assigned_driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corporate_performance" ADD CONSTRAINT "corporate_performance_partner_id_logistics_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."logistics_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_top_ups" ADD CONSTRAINT "credit_top_ups_wallet_id_credit_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."credit_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_wallet_id_credit_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."credit_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transfers" ADD CONSTRAINT "credit_transfers_from_wallet_id_credit_wallets_id_fk" FOREIGN KEY ("from_wallet_id") REFERENCES "public"."credit_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transfers" ADD CONSTRAINT "credit_transfers_to_wallet_id_credit_wallets_id_fk" FOREIGN KEY ("to_wallet_id") REFERENCES "public"."credit_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_profile_id_business_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."business_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_earnings" ADD CONSTRAINT "delivery_earnings_delivery_personnel_id_delivery_personnel_id_fk" FOREIGN KEY ("delivery_personnel_id") REFERENCES "public"."delivery_personnel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_earnings" ADD CONSTRAINT "delivery_earnings_order_id_delivery_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."delivery_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_delivery_personnel_id_delivery_personnel_id_fk" FOREIGN KEY ("delivery_personnel_id") REFERENCES "public"."delivery_personnel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_personnel" ADD CONSTRAINT "delivery_personnel_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_reviews" ADD CONSTRAINT "delivery_reviews_order_id_delivery_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."delivery_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_reviews" ADD CONSTRAINT "delivery_reviews_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_reviews" ADD CONSTRAINT "delivery_reviews_delivery_personnel_id_delivery_personnel_id_fk" FOREIGN KEY ("delivery_personnel_id") REFERENCES "public"."delivery_personnel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_routes" ADD CONSTRAINT "delivery_routes_delivery_personnel_id_delivery_personnel_id_fk" FOREIGN KEY ("delivery_personnel_id") REFERENCES "public"."delivery_personnel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_routes" ADD CONSTRAINT "delivery_routes_order_id_delivery_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."delivery_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_orders" ADD CONSTRAINT "demo_orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_orders" ADD CONSTRAINT "demo_orders_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_transactions" ADD CONSTRAINT "demo_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_transactions" ADD CONSTRAINT "demo_transactions_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_transactions" ADD CONSTRAINT "demo_transactions_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_wallets" ADD CONSTRAINT "demo_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestions" ADD CONSTRAINT "design_suggestions_renovation_plan_id_renovation_plans_id_fk" FOREIGN KEY ("renovation_plan_id") REFERENCES "public"."renovation_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_cb_profiles" ADD CONSTRAINT "driver_cb_profiles_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_cb_profiles" ADD CONSTRAINT "driver_cb_profiles_current_channel_id_cb_radio_channels_id_fk" FOREIGN KEY ("current_channel_id") REFERENCES "public"."cb_radio_channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_corporate_preferences" ADD CONSTRAINT "driver_corporate_preferences_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_fleets" ADD CONSTRAINT "driver_fleets_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_communications" ADD CONSTRAINT "email_communications_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_communications" ADD CONSTRAINT "email_communications_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_communications" ADD CONSTRAINT "email_communications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_communications" ADD CONSTRAINT "email_communications_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_communications" ADD CONSTRAINT "email_communications_assignment_id_job_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."job_assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_checkouts" ADD CONSTRAINT "equipment_checkouts_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_checkouts" ADD CONSTRAINT "equipment_checkouts_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_checkouts" ADD CONSTRAINT "equipment_checkouts_hub_id_equipment_hubs_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."equipment_hubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_checkouts" ADD CONSTRAINT "equipment_checkouts_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_hub_inventory" ADD CONSTRAINT "equipment_hub_inventory_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_hub_inventory" ADD CONSTRAINT "equipment_hub_inventory_hub_id_equipment_hubs_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."equipment_hubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_hubs" ADD CONSTRAINT "equipment_hubs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_hubs" ADD CONSTRAINT "equipment_hubs_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "errand_groups" ADD CONSTRAINT "errand_groups_assigned_driver_id_users_id_fk" FOREIGN KEY ("assigned_driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "errand_groups" ADD CONSTRAINT "errand_groups_zone_id_pricing_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."pricing_zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_reminders" ADD CONSTRAINT "expense_reminders_expense_id_business_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."business_expenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fare_calculations" ADD CONSTRAINT "fare_calculations_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_travel_booking_id_travel_bookings_id_fk" FOREIGN KEY ("travel_booking_id") REFERENCES "public"."travel_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancers" ADD CONSTRAINT "freelancers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_travel_booking_id_travel_bookings_id_fk" FOREIGN KEY ("travel_booking_id") REFERENCES "public"."travel_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_roles" ADD CONSTRAINT "hotel_roles_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_shifts" ADD CONSTRAINT "hotel_shifts_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_shifts" ADD CONSTRAINT "hotel_shifts_role_id_hotel_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."hotel_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "human_operators" ADD CONSTRAINT "human_operators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immigration_applications" ADD CONSTRAINT "immigration_applications_program_id_immigration_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."immigration_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_vehicle_id_registration_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."registration_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_logs" ADD CONSTRAINT "integration_logs_partner_id_logistics_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."logistics_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_logs" ADD CONSTRAINT "integration_logs_corporate_job_id_corporate_jobs_id_fk" FOREIGN KEY ("corporate_job_id") REFERENCES "public"."corporate_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_supervisor_id_supervisors_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."supervisors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_terminated_by_users_id_fk" FOREIGN KEY ("terminated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_programs" ADD CONSTRAINT "learning_programs_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_programs" ADD CONSTRAINT "learning_programs_apprentice_id_users_id_fk" FOREIGN KEY ("apprentice_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_signals" ADD CONSTRAINT "learning_signals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_cases" ADD CONSTRAINT "legal_cases_lawyer_id_legal_providers_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."legal_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifestyle_addons" ADD CONSTRAINT "lifestyle_addons_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_updates" ADD CONSTRAINT "location_updates_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_updates" ADD CONSTRAINT "location_updates_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_program" ADD CONSTRAINT "loyalty_program_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_analysis" ADD CONSTRAINT "material_analysis_ar_scan_id_ar_scans_id_fk" FOREIGN KEY ("ar_scan_id") REFERENCES "public"."ar_scans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_translations" ADD CONSTRAINT "message_translations_message_id_chat_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obd_readings" ADD CONSTRAINT "obd_readings_test_id_obd_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."obd_tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_expense_id_business_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."business_expenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_jobs" ADD CONSTRAINT "payment_jobs_expense_id_business_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."business_expenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_commissions" ADD CONSTRAINT "platform_commissions_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_commissions" ADD CONSTRAINT "platform_commissions_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_commissions" ADD CONSTRAINT "platform_commissions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_payments" ADD CONSTRAINT "platform_payments_task_id_autonomous_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."autonomous_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_payments" ADD CONSTRAINT "platform_payments_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "precision_measurements" ADD CONSTRAINT "precision_measurements_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_calculations" ADD CONSTRAINT "price_calculations_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_primary_supplier_id_suppliers_id_fk" FOREIGN KEY ("primary_supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_scanner_user_id_users_id_fk" FOREIGN KEY ("scanner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_availability" ADD CONSTRAINT "property_availability_property_id_rental_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."rental_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_inquiries" ADD CONSTRAINT "property_inquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_inquiries" ADD CONSTRAINT "property_inquiries_inquirer_id_users_id_fk" FOREIGN KEY ("inquirer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_maintenance" ADD CONSTRAINT "property_maintenance_property_id_rental_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."rental_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_tasks" ADD CONSTRAINT "quick_tasks_poster_id_users_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_tasks" ADD CONSTRAINT "quick_tasks_assigned_worker_id_users_id_fk" FOREIGN KEY ("assigned_worker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_audit_logs" ADD CONSTRAINT "rbac_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_payouts" ADD CONSTRAINT "rbac_payouts_driver_user_id_users_id_fk" FOREIGN KEY ("driver_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_role_permissions" ADD CONSTRAINT "rbac_role_permissions_role_id_rbac_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."rbac_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_user_roles" ADD CONSTRAINT "rbac_user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_user_roles" ADD CONSTRAINT "rbac_user_roles_role_id_rbac_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."rbac_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_work_areas" ADD CONSTRAINT "rbac_work_areas_locked_by_user_id_users_id_fk" FOREIGN KEY ("locked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_assignments" ADD CONSTRAINT "reg_assignments_request_id_reg_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."reg_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_assignments" ADD CONSTRAINT "reg_assignments_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_events" ADD CONSTRAINT "reg_events_request_id_reg_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."reg_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_payouts" ADD CONSTRAINT "reg_payouts_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_payouts" ADD CONSTRAINT "reg_payouts_request_id_reg_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."reg_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_requests" ADD CONSTRAINT "reg_requests_application_id_registration_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."registration_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_requests" ADD CONSTRAINT "reg_requests_owner_id_vehicle_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."vehicle_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_requests" ADD CONSTRAINT "reg_requests_vehicle_id_registration_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."registration_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_requests" ADD CONSTRAINT "reg_requests_service_code_reg_service_catalog_code_fk" FOREIGN KEY ("service_code") REFERENCES "public"."reg_service_catalog"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reg_sla" ADD CONSTRAINT "reg_sla_request_id_reg_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."reg_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_applications" ADD CONSTRAINT "registration_applications_vehicle_id_registration_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."registration_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_applications" ADD CONSTRAINT "registration_applications_owner_id_vehicle_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."vehicle_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_applications" ADD CONSTRAINT "registration_applications_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_payments" ADD CONSTRAINT "registration_payments_application_id_registration_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."registration_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_vehicles" ADD CONSTRAINT "registration_vehicles_owner_id_vehicle_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."vehicle_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renovation_contractors" ADD CONSTRAINT "renovation_contractors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renovation_plans" ADD CONSTRAINT "renovation_plans_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renovation_plans" ADD CONSTRAINT "renovation_plans_planner_id_users_id_fk" FOREIGN KEY ("planner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renovation_plans" ADD CONSTRAINT "renovation_plans_before_scan_id_ar_scans_id_fk" FOREIGN KEY ("before_scan_id") REFERENCES "public"."ar_scans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_property_id_rental_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."rental_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_renter_id_users_id_fk" FOREIGN KEY ("renter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_properties" ADD CONSTRAINT "rental_properties_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_reviews" ADD CONSTRAINT "rental_reviews_booking_id_rental_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."rental_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_reviews" ADD CONSTRAINT "rental_reviews_property_id_rental_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."rental_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_reviews" ADD CONSTRAINT "rental_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reorder_requests" ADD CONSTRAINT "reorder_requests_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reorder_requests" ADD CONSTRAINT "reorder_requests_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reorder_requests" ADD CONSTRAINT "reorder_requests_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_renovations" ADD CONSTRAINT "room_renovations_renovation_plan_id_renovation_plans_id_fk" FOREIGN KEY ("renovation_plan_id") REFERENCES "public"."renovation_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_analytics" ADD CONSTRAINT "sales_analytics_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_analytics" ADD CONSTRAINT "sales_analytics_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_analytics" ADD CONSTRAINT "sales_analytics_top_customer_users_id_fk" FOREIGN KEY ("top_customer") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secure_browser_sessions" ADD CONSTRAINT "secure_browser_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_logs" ADD CONSTRAINT "security_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_quotes" ADD CONSTRAINT "service_quotes_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_quotes" ADD CONSTRAINT "service_quotes_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_reviews" ADD CONSTRAINT "service_reviews_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_reviews" ADD CONSTRAINT "service_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_reviews" ADD CONSTRAINT "service_reviews_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_tracking" ADD CONSTRAINT "shipment_tracking_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_shipping_partner_id_shipping_partners_id_fk" FOREIGN KEY ("shipping_partner_id") REFERENCES "public"."shipping_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_profile_id_business_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."business_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "structural_analysis" ADD CONSTRAINT "structural_analysis_ar_scan_id_ar_scans_id_fk" FOREIGN KEY ("ar_scan_id") REFERENCES "public"."ar_scans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supervisors" ADD CONSTRAINT "supervisors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supervisors" ADD CONSTRAINT "supervisors_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_errors" ADD CONSTRAINT "system_errors_subsystem_id_subsystems_id_fk" FOREIGN KEY ("subsystem_id") REFERENCES "public"."subsystems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_health_checks" ADD CONSTRAINT "system_health_checks_subsystem_id_subsystems_id_fk" FOREIGN KEY ("subsystem_id") REFERENCES "public"."subsystems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_applications" ADD CONSTRAINT "task_applications_task_id_quick_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."quick_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_applications" ADD CONSTRAINT "task_applications_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_payments" ADD CONSTRAINT "task_payments_task_id_quick_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."quick_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_payments" ADD CONSTRAINT "task_payments_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_payments" ADD CONSTRAINT "task_payments_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_workers" ADD CONSTRAINT "task_workers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_workers" ADD CONSTRAINT "task_workers_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_equipment" ADD CONSTRAINT "tool_equipment_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_reports" ADD CONSTRAINT "translation_reports_message_id_chat_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_reports" ADD CONSTRAINT "translation_reports_translation_id_message_translations_id_fk" FOREIGN KEY ("translation_id") REFERENCES "public"."message_translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_reports" ADD CONSTRAINT "translation_reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_bookings" ADD CONSTRAINT "travel_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_commissions" ADD CONSTRAINT "travel_commissions_travel_booking_id_travel_bookings_id_fk" FOREIGN KEY ("travel_booking_id") REFERENCES "public"."travel_bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_commissions" ADD CONSTRAINT "travel_commissions_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_assigned_driver_id_users_id_fk" FOREIGN KEY ("assigned_driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_zone_id_pricing_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."pricing_zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_rider_id_users_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mfa" ADD CONSTRAINT "user_mfa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "user_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_registration_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."registration_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_inspections" ADD CONSTRAINT "vehicle_inspections_vehicle_id_registration_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."registration_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_inspections" ADD CONSTRAINT "vehicle_inspections_evaluator_id_users_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_listings" ADD CONSTRAINT "vehicle_listings_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_listings" ADD CONSTRAINT "vehicle_listings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_owners" ADD CONSTRAINT "vehicle_owners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "virtual_tours" ADD CONSTRAINT "virtual_tours_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "virtual_tours" ADD CONSTRAINT "virtual_tours_viewer_id_users_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wholesale_orders" ADD CONSTRAINT "wholesale_orders_buyer_id_business_accounts_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."business_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wholesale_orders" ADD CONSTRAINT "wholesale_orders_supplier_id_business_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."business_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wholesale_products" ADD CONSTRAINT "wholesale_products_supplier_id_business_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."business_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_schedules" ADD CONSTRAINT "work_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workers" ADD CONSTRAINT "workers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_order_items" ADD CONSTRAINT "yaadflex_order_items_order_id_yaadflex_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."yaadflex_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_order_items" ADD CONSTRAINT "yaadflex_order_items_product_id_yaadflex_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."yaadflex_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_orders" ADD CONSTRAINT "yaadflex_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_orders" ADD CONSTRAINT "yaadflex_orders_supplier_id_yaadflex_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."yaadflex_suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_pay_cards" ADD CONSTRAINT "yaadflex_pay_cards_user_id_yaadflex_pay_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."yaadflex_pay_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_pay_transactions" ADD CONSTRAINT "yaadflex_pay_transactions_from_user_id_yaadflex_pay_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."yaadflex_pay_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_pay_transactions" ADD CONSTRAINT "yaadflex_pay_transactions_to_user_id_yaadflex_pay_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."yaadflex_pay_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_pay_wallets" ADD CONSTRAINT "yaadflex_pay_wallets_user_id_yaadflex_pay_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."yaadflex_pay_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_product_reviews" ADD CONSTRAINT "yaadflex_product_reviews_product_id_yaadflex_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."yaadflex_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_product_reviews" ADD CONSTRAINT "yaadflex_product_reviews_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_product_reviews" ADD CONSTRAINT "yaadflex_product_reviews_order_id_yaadflex_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."yaadflex_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_products" ADD CONSTRAINT "yaadflex_products_category_id_yaadflex_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."yaadflex_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yaadflex_products" ADD CONSTRAINT "yaadflex_products_supplier_id_yaadflex_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."yaadflex_suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_driver_channel" ON "cb_channel_subscriptions" USING btree ("driver_id","channel_id");--> statement-breakpoint
CREATE INDEX "idx_channel_timestamp" ON "cb_radio_messages" USING btree ("channel_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_chat" ON "chat_messages" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_sender" ON "chat_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_created" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_participants_chat" ON "chat_participants" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "idx_chat_participants_user" ON "chat_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_demo_tx_user" ON "demo_transactions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_demo_tx_type" ON "demo_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_demo_wallet_user" ON "demo_wallets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_emails_from_user" ON "email_communications" USING btree ("from_user_id");--> statement-breakpoint
CREATE INDEX "idx_emails_to_user" ON "email_communications" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX "idx_emails_job" ON "email_communications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_emails_status" ON "email_communications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_equipment_category" ON "equipment" USING btree ("category","subcategory");--> statement-breakpoint
CREATE INDEX "idx_equipment_available" ON "equipment" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "idx_checkouts_worker" ON "equipment_checkouts" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "idx_checkouts_equipment" ON "equipment_checkouts" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "idx_checkouts_status" ON "equipment_checkouts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_checkouts_overdue" ON "equipment_checkouts" USING btree ("is_overdue");--> statement-breakpoint
CREATE INDEX "idx_hub_inventory_equipment" ON "equipment_hub_inventory" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "idx_hub_inventory_hub" ON "equipment_hub_inventory" USING btree ("hub_id");--> statement-breakpoint
CREATE INDEX "idx_hubs_location" ON "equipment_hubs" USING btree ("city","latitude","longitude");--> statement-breakpoint
CREATE INDEX "idx_hubs_active" ON "equipment_hubs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_applications_job" ON "job_applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_applications_worker" ON "job_applications" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "idx_applications_status" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_assignments_job" ON "job_assignments" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_assignments_worker" ON "job_assignments" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "idx_assignments_supervisor" ON "job_assignments" USING btree ("supervisor_id");--> statement-breakpoint
CREATE INDEX "idx_assignments_status" ON "job_assignments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_jobs_type_status" ON "jobs" USING btree ("job_type","status");--> statement-breakpoint
CREATE INDEX "idx_jobs_location" ON "jobs" USING btree ("city","latitude","longitude");--> statement-breakpoint
CREATE INDEX "idx_jobs_company" ON "jobs" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_translation_message_lang" ON "message_translations" USING btree ("message_id","target_lang");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_translation_reports_message" ON "translation_reports" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "idx_translation_reports_status" ON "translation_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_user_currency" ON "user_wallets" USING btree ("user_id","currency");--> statement-breakpoint
CREATE INDEX "idx_vehicles_make_model" ON "vehicle_listings" USING btree ("make","model");--> statement-breakpoint
CREATE INDEX "idx_vehicles_price" ON "vehicle_listings" USING btree ("price");--> statement-breakpoint
CREATE INDEX "idx_vehicles_location" ON "vehicle_listings" USING btree ("city","latitude","longitude");--> statement-breakpoint
CREATE INDEX "idx_vehicles_status" ON "vehicle_listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_workers_location" ON "workers" USING btree ("city","latitude","longitude");--> statement-breakpoint
CREATE INDEX "idx_workers_skills" ON "workers" USING btree ("skills");--> statement-breakpoint
CREATE INDEX "idx_workers_available" ON "workers" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "idx_yf_pay_from_user" ON "yaadflex_pay_transactions" USING btree ("from_user_id");--> statement-breakpoint
CREATE INDEX "idx_yf_pay_to_user" ON "yaadflex_pay_transactions" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX "idx_yf_pay_status" ON "yaadflex_pay_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_yf_pay_created" ON "yaadflex_pay_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_yf_pay_user_currency" ON "yaadflex_pay_wallets" USING btree ("user_id","currency");