package com.mandala.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PaymentMethod {
    @JsonProperty("CREDIT_CARD")
    CREDIT_CARD,

    @JsonProperty("DEBIT_CARD")
    DEBIT_CARD,

    @JsonProperty("PAYPAL")
    PAYPAL,

    @JsonProperty("CASH_ON_DELIVERY")
    CASH_ON_DELIVERY
}
