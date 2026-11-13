from typing import Dict, Any, List

def generate_cluster_insights(cluster_profiles: List[Dict[str, Any]], global_means: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Analyzes cluster characteristics dynamically relative to global averages
    and generates business persona, behavioral profile, opportunities, and tailored marketing strategies.
    """
    insights = []
    
    # Identify key feature names if present
    income_col = next((f for f in global_means.keys() if any(k in f.lower() for k in ['income', 'salary', 'earnings'])), None)
    spend_col = next((f for f in global_means.keys() if any(k in f.lower() for k in ['spend', 'score', 'amount', 'expenditure'])), None)
    age_col = next((f for f in global_means.keys() if 'age' in f.lower()), None)
    freq_col = next((f for f in global_means.keys() if any(k in f.lower() for k in ['freq', 'count', 'orders', 'purchases'])), None)

    for cluster in cluster_profiles:
        cid = cluster["cluster_id"]
        count = cluster["count"]
        pct = cluster["percentage"]
        means = cluster["feature_means"]
        
        # Calculate relative deltas
        is_high_income = False
        is_high_spend = False
        is_young = False
        is_high_freq = False
        
        income_ratio = 1.0
        spend_ratio = 1.0
        
        if income_col and global_means.get(income_col, 0) > 0:
            income_ratio = means[income_col] / global_means[income_col]
            is_high_income = income_ratio >= 1.05
        
        if spend_col and global_means.get(spend_col, 0) > 0:
            spend_ratio = means[spend_col] / global_means[spend_col]
            is_high_spend = spend_ratio >= 1.05
            
        if age_col:
            age_mean = means[age_col]
            global_age = global_means.get(age_col, 40)
            is_young = age_mean < global_age
            
        if freq_col and global_means.get(freq_col, 0) > 0:
            is_high_freq = means[freq_col] > global_means[freq_col]

        # Determine Persona and Business Narrative
        if income_col and spend_col:
            if is_high_income and is_high_spend:
                persona_name = "VIP / Affluent Spenders"
                badge_color = "emerald"
                tagline = "High purchasing power with elevated brand engagement."
                characteristics = (
                    f"Represents high-value patrons with an above-average income ({means[income_col]:.1f} vs avg {global_means[income_col]:.1f}) "
                    f"and an aggressive spending pattern ({means[spend_col]:.1f} vs avg {global_means[spend_col]:.1f}). "
                    f"They prioritize premium quality, prestige, and seamless concierge service over price discounts."
                )
                opportunities = "Prime candidates for premium loyalty tiers, bespoke memberships, white-glove personal shopping, and luxury product lines."
                strategies = [
                    "Enroll in VIP concierge program with dedicated relationship managers.",
                    "Offer exclusive pre-launch access to premium product collections.",
                    "Focus on brand prestige, personalized experiences, and zero friction rather than promotional discounts.",
                    "Host private invite-only showcase events and complimentary product testing."
                ]
                channels = ["Dedicated VIP Email Concierge", "Personalized Direct Mail", "Exclusive App Hub", "Private WhatsApp Clienteling"]
                retention_risk = "Low"
                business_value = "Highest Revenue Driver"

            elif is_high_income and not is_high_spend:
                persona_name = "Cautious Savers / Untapped Potential"
                badge_color = "blue"
                tagline = "Substantial income reserves but conservative buying habits."
                characteristics = (
                    f"Customers have strong purchasing capacity ({means[income_col]:.1f} vs avg {global_means[income_col]:.1f}), "
                    f"yet their current spending score remains disciplined ({means[spend_col]:.1f} vs avg {global_means[spend_col]:.1f}). "
                    f"They evaluate utility, longevity, and return-on-investment before completing purchases."
                )
                opportunities = "Immense potential for revenue expansion through educational value propositions, warranty perks, and product durability assurances."
                strategies = [
                    "Deliver value-centric educational content, product comparison guides, and verified reviews.",
                    "Provide low-risk trial offers, extended warranties, and satisfaction guarantees.",
                    "Send curated recommendations tailored to specific functional needs.",
                    "Highlight long-term investment value and cost-per-use economics."
                ]
                channels = ["Targeted Email Newsletters", "Thought-Leadership Case Studies", "In-App Product Comparison Tools"]
                retention_risk = "Medium"
                business_value = "High Growth Opportunity"

            elif not is_high_income and is_high_spend:
                persona_name = "Aspirational / Trend-Driven Shoppers"
                badge_color = "amber"
                tagline = "Eager consumers seeking style and trends with elastic budgets."
                characteristics = (
                    f"Despite modest income brackets ({means[income_col]:.1f} vs avg {global_means[income_col]:.1f}), "
                    f"this segment exhibits remarkably high spending eagerness ({means[spend_col]:.1f} vs avg {global_means[spend_col]:.1f}). "
                    f"They are highly responsive to social media trends, viral fashion, and limited-time collections."
                )
                opportunities = "Excellent target for high-velocity seasonal sales, trend-driven merchandizing, and flexible 'Buy Now Pay Later' financing."
                strategies = [
                    "Implement flexible payment solutions (BNPL, installment plans, split payments).",
                    "Deploy scarcity and urgency marketing (flash drops, countdown discounts).",
                    "Incentivize user-generated content (UGC) with reward point bonuses.",
                    "Introduce accessible entry-level luxury items to maintain purchase frequency."
                ]
                channels = ["Instagram & TikTok Ads", "Push Notifications", "Influencer Collaborations", "SMS Flash Sales"]
                retention_risk = "High"
                business_value = "High Velocity Volume"

            elif (not is_high_income) and (not is_high_spend):
                # Check if strictly low or moderate
                if income_ratio < 0.85 and spend_ratio < 0.85:
                    persona_name = "Budget-Conscious / Value Seekers"
                    badge_color = "slate"
                    tagline = "Price-sensitive buyers seeking maximum utility and frugality."
                    characteristics = (
                        f"Features conservative spenders ({means[spend_col]:.1f}) with constrained income ({means[income_col]:.1f}). "
                        f"Every transaction is calculated based on necessity, price-point, and promotional discounts."
                    )
                    opportunities = "Clearance inventory liquidation, discount subscription bundles, and referral discount acquisition."
                    strategies = [
                        "Offer volume bundle discounts, clearance promotions, and coupon codes.",
                        "Provide transparent pricing with zero surprise charges or fees.",
                        "Emphasize essential utility, durability, and practical everyday items.",
                        "Implement customer referral bonus coupons to reduce customer acquisition costs."
                    ]
                    channels = ["Automated Email Discounts", "Deal Notification Banners", "SMS Discount Codes"]
                    retention_risk = "High"
                    business_value = "Margin-Sensitive Base"
                else:
                    persona_name = "Core / Mainstream Balancers"
                    badge_color = "indigo"
                    tagline = "Predictable, steady customers forming the operational backbone."
                    characteristics = (
                        f"Positioned near median benchmarks (Income: {means[income_col]:.1f}, Spend: {means[spend_col]:.1f}). "
                        f"Reliable, routine buyers who value consistency, fairness, and dependable product quality."
                    )
                    opportunities = "Cross-selling adjacent categories and building sustainable recurring subscription habits."
                    strategies = [
                        "Introduce tiered rewards that gently motivate moving to higher purchase thresholds.",
                        "Promote relevant cross-sells and complementary accessories.",
                        "Deliver consistent, high-standard customer support to foster long-term loyalty.",
                        "Utilize seasonal loyalty milestone gifts to reward longevity."
                    ]
                    channels = ["Weekly Curated Newsletters", "Mobile App Banners", "Loyalty Dashboard Alerts"]
                    retention_risk = "Low"
                    business_value = "Core Stability Anchor"
        else:
            # Fallback for generic feature combinations
            persona_name = f"Segment {cid + 1} Profile"
            badge_color = "sky"
            tagline = f"Distinct customer group representing {pct}% of user base."
            characteristics = f"Characterized by cluster center: " + ", ".join([f"{k}: {v:.1f}" for k, v in means.items()])
            opportunities = "Targeted segment-specific campaigns based on dominant cluster features."
            strategies = [
                f"Design promotions centered around highest indexed metric.",
                "A/B test marketing hooks to identify highest converting value propositions.",
                "Monitor purchase cycle interval and re-engage upon expected replenishment date."
            ]
            channels = ["Email Campaigns", "Digital Retargeting", "In-App Banners"]
            retention_risk = "Medium"
            business_value = "Strategic Focus Segment"

        # Demographics nuance if Age is available
        demographic_note = ""
        if age_col:
            age_val = means[age_col]
            if age_val < 30:
                demographic_note = f"Predominantly young demographic (Average Age: {age_val:.0f} yrs). Highly digitally native; prioritize mobile-first engagement."
            elif age_val < 50:
                demographic_note = f"Mid-career demographic (Average Age: {age_val:.0f} yrs). Peak earning and family-oriented purchasing behaviors."
            else:
                demographic_note = f"Mature demographic (Average Age: {age_val:.0f} yrs). Brand-loyal with preference for clear, trustworthy customer service."

        insights.append({
            "cluster_id": cid,
            "persona_name": persona_name,
            "tagline": tagline,
            "badge_color": badge_color,
            "count": count,
            "percentage": pct,
            "characteristics": characteristics,
            "demographic_note": demographic_note,
            "opportunities": opportunities,
            "strategies": strategies,
            "channels": channels,
            "retention_risk": retention_risk,
            "business_value": business_value,
            "feature_means": means
        })
        
    return insights
